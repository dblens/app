import React from 'react';

interface SchemaListProps {
  schemas: string[];
  selectedSchema?: string;
  setSelectedSchema: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const SchemaList: React.FC<SchemaListProps> = ({
  schemas = [],
  selectedSchema = '',
  setSelectedSchema,
}: SchemaListProps) => {
  return (
    <div className="relative inline-block w-full text-gray-700">
      <select
        className="appearance-none bg-gray-900 border focus:shadow-outline p-2 placeholder-gray-600 text-gray-200 text-xs w-full"
        placeholder="Regular input"
        value={selectedSchema}
        onChange={(e) => setSelectedSchema(e.target.value)}
      >
        {schemas.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
SchemaList.defaultProps = {
  selectedSchema: 'false',
};

export default SchemaList;
