
import { Entity } from "@/types/Entity";

export const generateAIRecommendations = async (entities: Entity[]): Promise<string> => {
  // Simulate AI analysis - in a real implementation, this would call an AI service
  
  const recommendations: string[] = [];
  
  // Analyze relationships
  const foreignKeys = entities.flatMap(entity => 
    entity.columns
      .filter(col => col.isForeignKey)
      .map(col => ({ entity: entity.name, column: col.name }))
  );
  
  if (foreignKeys.length > 0) {
    recommendations.push("🔗 RELATIONSHIP RECOMMENDATIONS:");
    foreignKeys.forEach(fk => {
      const referencedTable = fk.column.replace('_id', '');
      recommendations.push(`• Link ${fk.entity}.${fk.column} to ${referencedTable}.id (One-to-Many)`);
    });
    recommendations.push("");
  }

  // Identify potential fact and dimension tables
  const factTables = entities.filter(entity => 
    entity.columns.some(col => col.isForeignKey) && 
    entity.columns.filter(col => col.isForeignKey).length >= 2
  );
  
  const dimensionTables = entities.filter(entity => 
    !factTables.includes(entity) && 
    entity.columns.some(col => col.isPrimaryKey)
  );

  if (factTables.length > 0 || dimensionTables.length > 0) {
    recommendations.push("📊 DIMENSIONAL MODELING SUGGESTIONS:");
    
    if (factTables.length > 0) {
      recommendations.push("FACT TABLES (contain metrics and foreign keys):");
      factTables.forEach(table => {
        recommendations.push(`• ${table.name} - Consider adding measures like quantities, amounts, or counts`);
      });
      recommendations.push("");
    }
    
    if (dimensionTables.length > 0) {
      recommendations.push("DIMENSION TABLES (contain descriptive attributes):");
      dimensionTables.forEach(table => {
        recommendations.push(`• ${table.name} - Good candidate for dimension with descriptive attributes`);
      });
      recommendations.push("");
    }
  }

  // Normalization suggestions
  const largeEntities = entities.filter(entity => entity.columns.length > 8);
  if (largeEntities.length > 0) {
    recommendations.push("🔧 NORMALIZATION RECOMMENDATIONS:");
    largeEntities.forEach(entity => {
      recommendations.push(`• Consider breaking down ${entity.name} into smaller, more focused entities`);
      recommendations.push(`  - Separate core attributes from optional/descriptive ones`);
      recommendations.push(`  - Group related columns into separate entities`);
    });
    recommendations.push("");
  }

  // Index suggestions
  const indexableColumns = entities.flatMap(entity =>
    entity.columns
      .filter(col => col.isForeignKey || col.name.includes('date') || col.name.includes('time'))
      .map(col => ({ entity: entity.name, column: col.name }))
  );

  if (indexableColumns.length > 0) {
    recommendations.push("⚡ PERFORMANCE RECOMMENDATIONS:");
    recommendations.push("Consider adding indexes on these columns for better query performance:");
    indexableColumns.forEach(col => {
      recommendations.push(`• ${col.entity}.${col.column}`);
    });
  }

  return recommendations.join('\n') || "No specific recommendations at this time. Your schema looks well-structured!";
};
