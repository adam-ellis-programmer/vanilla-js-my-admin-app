function getDAta() {
  return fetch('./data.json').then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return response.json() // Parse and return JSON data
  })
}
// convert function to a new promise or async
async function ensureDataInLocalStorage() {
  const appItems = JSON.parse(localStorage.getItem('app2Items'))

  if (!Array.isArray(appItems) || appItems.length === 0) {
    console.log('LocalStorage is empty, loading dummy data...')
    try {
      const data = await getDAta() // Fetch dummy data
      localStorage.setItem('app2Items', JSON.stringify(data)) // Populate localStorage
      console.log('Dummy data loaded into localStorage:', data)
    } catch (error) {
      console.error('Failed to fetch and set dummy data:', error)
    }
  } else {
    console.log('LocalStorage already has data:', appItems)
  }
}

// **** this is an IFFIE ??
// Main logic
;(async function init() {
  await ensureDataInLocalStorage()
  console.log('Data ensured in localStorage. You can now display it.')
})()
