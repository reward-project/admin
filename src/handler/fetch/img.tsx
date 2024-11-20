
import apiClient from "@handler/fetch/fetch";
export   async function urlToFile(url: string): Promise<File> {
    // URL에서 파일 데이터를 가져옴
    const response = await fetch(url);
  
    // 응답이 성공적이지 않을 경우 에러 처리
    if (!response.ok) {
      throw new Error('파일을 가져오지 못했습니다.');
    }
  
    // 응답 데이터를 Blob으로 변환
    const blob = await response.blob();
  
    // URL에서 파일 이름을 추출 (기본 파일 이름은 'file'로 설정)
    const parsedUrl = new URL(url);
    const fileName = parsedUrl.pathname.split('/').pop() || 'file';
  
    // Blob에서 MIME 타입을 추출하여 File 객체 생성
    const file = new File([blob], fileName, { type: blob.type });
  
    return file;
  }
  export async function fetchImageUrl(fileName: string): Promise<string> {
    console.log(fileName)
    // fileName이 없으면 빈 값을 반환
    if (!fileName) {
      return '';
    }
  
    // fileName이 있는 경우에만 요청 실행
    const response = await apiClient(`/files/url?filename=${fileName}`,{}, "text");
    console.log(response)
    return response; // 서버에서 URL을 반환한다고 가정
  }
  
  