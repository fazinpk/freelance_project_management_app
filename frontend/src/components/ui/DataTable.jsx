const DataTable = ({ columns, data }) => {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-slate-50">
              {columns.map((column) => {
                const value = typeof column.accessor === 'function'
                  ? column.accessor(row)
                  : row[column.accessor];

                return (
                  <td key={column.header} className="px-6 py-4 text-sm text-slate-700">
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
