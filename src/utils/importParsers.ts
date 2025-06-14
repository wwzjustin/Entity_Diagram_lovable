
import { Entity, Column } from "@/types/Entity";

export const parseSQLScript = (sqlScript: string): Entity[] => {
  const entities: Entity[] = [];
  
  // Split by CREATE TABLE statements
  const tableStatements = sqlScript
    .split(/CREATE\s+TABLE/i)
    .filter(statement => statement.trim().length > 0);

  tableStatements.forEach((statement, index) => {
    if (index === 0 && !statement.includes('(')) return; // Skip if first part doesn't contain table definition

    try {
      // Extract table name
      const nameMatch = statement.match(/^\s*(\w+)\s*\(/i);
      if (!nameMatch) return;
      
      const tableName = nameMatch[1];
      
      // Extract column definitions
      const columnsSection = statement.substring(statement.indexOf('(') + 1, statement.lastIndexOf(')'));
      const columnLines = columnsSection.split(',').map(line => line.trim()).filter(line => line.length > 0);
      
      const columns: Column[] = [];
      
      columnLines.forEach(line => {
        // Skip constraint definitions
        if (line.toUpperCase().includes('CONSTRAINT') || 
            line.toUpperCase().includes('PRIMARY KEY') || 
            line.toUpperCase().includes('FOREIGN KEY') ||
            line.toUpperCase().includes('UNIQUE') ||
            line.toUpperCase().includes('CHECK')) return;

        // Parse column definition
        const parts = line.split(/\s+/);
        if (parts.length < 2) return;

        const columnName = parts[0];
        const dataType = parts[1];
        
        const isPrimaryKey = line.toUpperCase().includes('PRIMARY KEY');
        const isForeignKey = line.toUpperCase().includes('REFERENCES') || columnName.toLowerCase().endsWith('_id');
        
        columns.push({
          id: `col-${Date.now()}-${Math.random()}`,
          name: columnName,
          dataType: dataType,
          isPrimaryKey,
          isForeignKey,
        });
      });

      if (columns.length > 0) {
        entities.push({
          id: `entity-${Date.now()}-${index}`,
          name: tableName,
          columns,
          position: { x: 100 + (index * 350), y: 100 + (Math.floor(index / 3) * 250) },
          visible: true,
        });
      }
    } catch (error) {
      console.error(`Error parsing table statement: ${statement}`, error);
    }
  });

  return entities;
};

export const parseExcelData = async (file: File): Promise<Entity[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const entities: Entity[] = [];
        
        if (file.name.endsWith('.csv')) {
          // Parse CSV
          const lines = data.split('\n').filter(line => line.trim());
          if (lines.length < 2) {
            resolve([]);
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          // Create a single entity from CSV
          const columns: Column[] = headers.map((header, index) => ({
            id: `col-${Date.now()}-${index}`,
            name: header,
            dataType: 'VARCHAR(255)', // Default type
            isPrimaryKey: index === 0, // First column as PK
            isForeignKey: header.toLowerCase().endsWith('_id'),
          }));

          entities.push({
            id: `entity-${Date.now()}`,
            name: file.name.replace('.csv', ''),
            columns,
            position: { x: 100, y: 100 },
            visible: true,
          });
        } else {
          // For Excel files, we'll create a basic parser
          // In a real implementation, you'd use a library like xlsx
          const mockEntity: Entity = {
            id: `entity-${Date.now()}`,
            name: file.name.replace(/\.(xlsx|xls)$/, ''),
            columns: [
              {
                id: `col-${Date.now()}-1`,
                name: 'id',
                dataType: 'INTEGER',
                isPrimaryKey: true,
              },
              {
                id: `col-${Date.now()}-2`,
                name: 'name',
                dataType: 'VARCHAR(255)',
              },
            ],
            position: { x: 100, y: 100 },
            visible: true,
          };
          entities.push(mockEntity);
        }
        
        resolve(entities);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
