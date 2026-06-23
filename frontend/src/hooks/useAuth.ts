export function isAuthenticated() {
  return Boolean(localStorage.getItem('pk_token'))
}

export function logout() {
  localStorage.removeItem('pk_token')
}
