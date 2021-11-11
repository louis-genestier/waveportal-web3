const Table = ({ waves }) => {
    const wavesComponent = waves.map(wave =>
        <tr key={ wave.timestamp + wave.waver }>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-white">
              { wave.waver }
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-white">
              { wave.timestamp }
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-white">
              { wave.message }
            </div>
          </td>
        </tr>
      )

    return (
        <table className="min-w-full divide-y divide-purple-400">
            <thead className="dark:bg-gray-800">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waver
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                    </th>
                </tr>
            </thead>
            <tbody className="dark:bg-gray-900 bg-opacity-10 divide-y divide-purple-400">
                { wavesComponent }
            </tbody>
        </table>
    )
}

export default Table;