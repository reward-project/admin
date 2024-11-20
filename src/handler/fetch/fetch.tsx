const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWithBaseURL(
  endpoint: string, 
  options: RequestInit = {}, 
  responseType: 'json' | 'text' = 'json' // 기본 응답 형식은 'json'
) {
  const url = `${baseURL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 인증 토큰을 추가하려면 주석 해제
    // 'Authorization': `Bearer ${token}`,
  };

  // 기본 요청 메서드와 옵션 설정
  const defaultOptions: RequestInit = {
    method: 'GET',
    cache: 'no-store',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // 요청 인터셉터처럼 동작하는 부분 (토큰이나 기타 옵션 추가 가능)
  const modifiedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log('Request sent:', url, modifiedOptions);

    const response = await fetch(url, modifiedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 응답 형식에 따라 json 또는 text로 처리
    let responseData;
    if (responseType === 'json') {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log(responseData);
    return responseData; // 응답 데이터 반환
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export default fetchWithBaseURL;
