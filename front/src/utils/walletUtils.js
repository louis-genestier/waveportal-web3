const getAccountsByMethod = async (ethereum, method) => {
  const accounts = await ethereum.request({ method })
  return accounts
}

export { getAccountsByMethod }
