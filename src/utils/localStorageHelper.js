export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};


export const clearState = () => {
  try{
    localStorage.removeItem("reduxState");
  }catch(err) {
    return undefined;
  }
}

export const setAuth = (token) => {
  const expiryTime = new Date().getTime() + ( 60 * 1000);
  localStorage.setItem('token', token);
  localStorage.setItem('expiryTime', expiryTime);
}

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const expiryTime = localStorage.getItem('expiryTime');

  if (!token || !expiryTime) {
    return false; // Không có token hoặc thời gian hết hạn, không đăng nhập
  }

  const currentTime = new Date().getTime();
  if (currentTime > expiryTime) {
    // Token hết hạn, xóa token và thời gian hết hạn
    localStorage.removeItem('token');
    localStorage.removeItem('expiryTime');
    return false; // Đăng xuất
  }

  return true; // Đăng nhập
}

export const logoutLocalStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expiryTime');
}