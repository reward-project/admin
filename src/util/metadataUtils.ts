import { Buffer } from "buffer";
import {
  MESSAGE_RSOCKET_ROUTING,
  MESSAGE_RSOCKET_AUTHENTICATION,
  WellKnownMimeType,
  encodeRoute,
  encodeCompositeMetadata
} from "rsocket-core";

export function createMetadata(route: string, token?: string): Buffer {
  const metadata: Array<[string | number | WellKnownMimeType, Buffer]> = [];

  // token이 있을 때만 인증 메타데이터 추가
  if (token) {
    const credentials = createBearerAuthMetadata(token);
    metadata.push([
      MESSAGE_RSOCKET_AUTHENTICATION,
      credentials
    ]);
  }

  // 라우팅 정보 인코딩
  const routeMetadata = encodeRoute(route);
  metadata.push([MESSAGE_RSOCKET_ROUTING, routeMetadata]);

  // Composite Metadata로 인코딩
  return encodeCompositeMetadata(metadata);
}

export function createAuthMetadata(username: string, password: string): Uint8Array {
  const authFlag = 1; // A 플래그 설정 (1 = well-known ID 사용)
  const authTypeId = 0x00; // `simple` 인증 유형 ID (0x00)

  // A 플래그와 Auth ID 설정
  const authIdLenArray = new Uint8Array(1);
  authIdLenArray[0] = (authFlag << 7) | authTypeId;

  // Username과 Password를 UTF-8로 인코딩
  const usernameArray = new TextEncoder().encode(username);
  const passwordArray = new TextEncoder().encode(password);

  // Username Length 포함한 인증 페이로드 배열 생성
  const usernameLengthArray = new Uint8Array(1);
  usernameLengthArray[0] = usernameArray.length;

  // 최종 인증 메타데이터 배열 생성
  const totalLength =
    authIdLenArray.length +
    usernameLengthArray.length +
    usernameArray.length +
    passwordArray.length;
  const authMetadataArray = new Uint8Array(totalLength);

  // 각 부분을 최종 배열에 설정
  let offset = 0;
  authMetadataArray.set(authIdLenArray, offset);
  offset += authIdLenArray.length;
  authMetadataArray.set(usernameLengthArray, offset);
  offset += usernameLengthArray.length;
  authMetadataArray.set(usernameArray, offset);
  offset += usernameArray.length;
  authMetadataArray.set(passwordArray, offset);

  return authMetadataArray;
}

export function createBearerAuthMetadata(token: string): Buffer {
  const authFlag = 1; // A 플래그 설정 (1 = well-known ID 사용)
  const authTypeId = 0x01; // `bearer` 인증 유형 ID (0x01)

  // A 플래그와 Auth ID 설정
  const authIdLenArray = new Uint8Array(1);
  authIdLenArray[0] = (authFlag << 7) | authTypeId;

  // Bearer Token을 UTF-8로 인코딩하여 Uint8Array로 변환
  const tokenArray = new TextEncoder().encode(token);

  // 최종 메타데이터 길이 계산 및 Uint8Array 생성
  const totalLength = authIdLenArray.length + tokenArray.length;
  const authMetadataArray = new Uint8Array(totalLength);

  // 각 부분을 authMetadataArray에 설정
  authMetadataArray.set(authIdLenArray, 0);
  authMetadataArray.set(tokenArray, authIdLenArray.length);

  // 최종 Uint8Array를 Buffer로 변환하여 반환
  return Buffer.from(authMetadataArray);
}

export function createSetupMetadata(token?: string): Buffer {
  const metadata: Array<[string | number | WellKnownMimeType, Buffer]> = [];

  // token이 있을 때만 인증 메타데이터 추가
  if (token) {
    console.log(token)
    const authMetadata = createBearerAuthMetadata(token);
    metadata.push([
      MESSAGE_RSOCKET_AUTHENTICATION,
      authMetadata
    ]);
  }

  // Composite Metadata로 인코딩
  return encodeCompositeMetadata(metadata);
}
