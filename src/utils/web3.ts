
declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('MetaMask 연결이 거부되었습니다.');
      }
      throw new Error('MetaMask 연결에 실패했습니다.');
    }
  } else {
    throw new Error('MetaMask가 설치되어 있지 않습니다.');
  }
}
