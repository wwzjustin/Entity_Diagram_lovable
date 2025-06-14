
import { Entity, Column } from "@/types/Entity";

export const applyAIRecommendations = async (entities: Entity[]): Promise<{
  updatedEntities: Entity[];
  newEntities: Entity[];
}> => {
  const updatedEntities: Entity[] = [];
  const newEntities: Entity[] = [];

  // Identify fact and dimension tables
  const factTables = entities.filter(entity => 
    entity.columns.some(col => col.isForeignKey) && 
    entity.columns.filter(col => col.isForeignKey).length >= 2
  );
  
  const dimensionTables = entities.filter(entity => 
    !factTables.includes(entity) && 
    entity.columns.some(col => col.isPrimaryKey)
  );

  // Process each entity
  entities.forEach(entity => {
    let processedEntity = { ...entity };

    // If it's a large entity (>8 columns), break it down
    if (entity.columns.length > 8 && !factTables.includes(entity)) {
      const { mainEntity, detailEntity } = breakDownLargeEntity(entity);
      updatedEntities.push(mainEntity);
      if (detailEntity) {
        newEntities.push(detailEntity);
      }
    } else {
      // Add missing relationships and optimize existing entities
      processedEntity = optimizeEntity(entity, entities);
      updatedEntities.push(processedEntity);
    }
  });

  // Create dimension tables for fact tables if missing
  factTables.forEach(factTable => {
    const missingDimensions = createMissingDimensions(factTable, [...entities, ...newEntities]);
    newEntities.push(...missingDimensions);
  });

  // Add date dimension if we have any date/time columns
  const hasDateColumns = entities.some(entity => 
    entity.columns.some(col => 
      col.dataType.toLowerCase().includes('date') || 
      col.dataType.toLowerCase().includes('time')
    )
  );

  if (hasDateColumns && !entities.find(e => e.name.toLowerCase().includes('date'))) {
    newEntities.push(createDateDimension());
  }

  return { updatedEntities, newEntities };
};

const breakDownLargeEntity = (entity: Entity): { mainEntity: Entity; detailEntity: Entity | null } => {
  const coreColumns = entity.columns.filter(col => 
    col.isPrimaryKey || 
    col.isForeignKey || 
    col.name.includes('name') || 
    col.name.includes('title') ||
    col.name.includes('id')
  );

  const detailColumns = entity.columns.filter(col => 
    !coreColumns.includes(col) &&
    (col.name.includes('description') || 
     col.name.includes('address') || 
     col.name.includes('detail') ||
     col.name.includes('note') ||
     col.dataType === 'TEXT')
  );

  const mainEntity: Entity = {
    ...entity,
    columns: coreColumns.length > 0 ? coreColumns : entity.columns.slice(0, 5),
  };

  let detailEntity: Entity | null = null;

  if (detailColumns.length > 0) {
    detailEntity = {
      id: `${entity.id}_details`,
      name: `${entity.name}_Details`,
      columns: [
        {
          id: `detail_id_${Date.now()}`,
          name: "id",
          dataType: "INTEGER",
          isPrimaryKey: true,
        },
        {
          id: `detail_fk_${Date.now()}`,
          name: `${entity.name.toLowerCase()}_id`,
          dataType: "INTEGER",
          isForeignKey: true,
        },
        ...detailColumns,
      ],
      position: { 
        x: entity.position.x + 400, 
        y: entity.position.y + 100 
      },
      visible: true,
    };
  }

  return { mainEntity, detailEntity };
};

const optimizeEntity = (entity: Entity, allEntities: Entity[]): Entity => {
  const optimizedColumns = entity.columns.map(column => {
    // Auto-detect foreign keys based on naming convention
    if (column.name.endsWith('_id') && !column.isPrimaryKey && !column.isForeignKey) {
      const referencedEntityName = column.name.replace('_id', '');
      const referencedEntity = allEntities.find(e => 
        e.name.toLowerCase() === referencedEntityName ||
        e.name.toLowerCase().replace(' ', '_') === referencedEntityName
      );
      
      if (referencedEntity) {
        return { ...column, isForeignKey: true };
      }
    }
    
    return column;
  });

  return {
    ...entity,
    columns: optimizedColumns,
  };
};

const createMissingDimensions = (factTable: Entity, existingEntities: Entity[]): Entity[] => {
  const newDimensions: Entity[] = [];
  
  factTable.columns.forEach(column => {
    if (column.isForeignKey) {
      const referencedEntityName = column.name.replace('_id', '');
      const exists = existingEntities.find(e => 
        e.name.toLowerCase() === referencedEntityName ||
        e.name.toLowerCase().replace(' ', '_') === referencedEntityName
      );
      
      if (!exists) {
        const newDimension: Entity = {
          id: `dim_${referencedEntityName}_${Date.now()}`,
          name: `${referencedEntityName.charAt(0).toUpperCase() + referencedEntityName.slice(1)}`,
          columns: [
            {
              id: `dim_pk_${Date.now()}`,
              name: "id",
              dataType: "INTEGER",
              isPrimaryKey: true,
            },
            {
              id: `dim_name_${Date.now()}`,
              name: "name",
              dataType: "VARCHAR(255)",
            },
            {
              id: `dim_desc_${Date.now()}`,
              name: "description",
              dataType: "TEXT",
            },
          ],
          position: { 
            x: factTable.position.x - 400, 
            y: factTable.position.y + newDimensions.length * 250 
          },
          visible: true,
        };
        
        newDimensions.push(newDimension);
      }
    }
  });
  
  return newDimensions;
};

const createDateDimension = (): Entity => {
  return {
    id: `date_dim_${Date.now()}`,
    name: "Date_Dimension",
    columns: [
      {
        id: `date_pk_${Date.now()}`,
        name: "date_id",
        dataType: "INTEGER",
        isPrimaryKey: true,
      },
      {
        id: `date_full_${Date.now()}`,
        name: "full_date",
        dataType: "DATE",
      },
      {
        id: `date_year_${Date.now()}`,
        name: "year",
        dataType: "INTEGER",
      },
      {
        id: `date_quarter_${Date.now()}`,
        name: "quarter",
        dataType: "INTEGER",
      },
      {
        id: `date_month_${Date.now()}`,
        name: "month",
        dataType: "INTEGER",
      },
      {
        id: `date_week_${Date.now()}`,
        name: "week",
        dataType: "INTEGER",
      },
      {
        id: `date_day_${Date.now()}`,
        name: "day",
        dataType: "INTEGER",
      },
    ],
    position: { x: 100, y: 500 },
    visible: true,
  };
};
