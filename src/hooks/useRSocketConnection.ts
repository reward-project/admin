import { RSocketClient, BufferEncoders, MESSAGE_RSOCKET_COMPOSITE_METADATA } from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import { Flowable } from "rsocket-flowable";
import { createMetadata, createSetupMetadata } from "@/util/metadataUtils";

interface StreamConfig {
    endpoint: string;
    onNext: (data: any) => void;
}
  
interface ChannelConfig {
    sourceRef: React.MutableRefObject<any>; // Retained sourceRef for sending messages
    onNext: (data: any) => void;
}
interface RSocketClientSetupConfig {
    clientRef: React.MutableRefObject<any>;
    token?: string; // token을 선택적으로 처리
    channels?: ChannelConfig[];
    streams?: StreamConfig[];
}

export const RSocketClientSetup = {
    init(
       { clientRef,
        token,
        channels,
        streams} : RSocketClientSetupConfig) {
        const client = createRSocketClient(token);
    
        client.connect().then((rsocket) => {
          clientRef.current = rsocket;
    
          channels?.forEach(({ sourceRef, onNext }) => {
            setupRequestChannel(rsocket, sourceRef, onNext);
          });
    
          streams?.forEach(({ endpoint, onNext }) => {
            setupRequestStream(rsocket, endpoint, token, onNext);
          });
        });
      },
   
      sendMessage(
        sourceRef: React.MutableRefObject<any>,
        message: any,
        metadata: any
      ) {
        const payload = createPayload(message);
        sourceRef?.current.onNext({
          data: payload,
          metadata,
        });
      },
};

// Helper function to create an RSocketClient instance
function createRSocketClient(token?: string) {
  return new RSocketClient({
    transport: new RSocketWebSocketClient(
      {
        url: process.env.NEXT_PUBLIC_RSOCKET_URL!,
      },
      BufferEncoders
    ),
    setup: {
      dataMimeType: "application/json",
      metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.toString(),
      keepAlive: 5000,
      lifetime: 60000,
      payload: {
        data: Buffer.alloc(0),
        metadata: token ? createSetupMetadata(token) : createSetupMetadata(),
      },
    },
  });
}

// Helper function to set up a request channel
function setupRequestChannel(rsocket: any, sourceRef: React.MutableRefObject<any>, onNext: (data: any) => void) {
    rsocket
      .requestChannel(
        new Flowable((source) => {
          sourceRef.current = source; 
          source.onSubscribe({
            cancel: () => {},
            request: (n) => {},
          });
        })
      )
      .subscribe({
        onComplete: () => console.log("requestChannel onComplete"),
        onSubscribe: (subscription: any) => {
          subscription.request(1000);
          console.log("requestChannel onSubscribe");
        },
        onError: (error: any) => console.log("requestChannel error: ", error),
        onNext: (payload: any) => {
          const data = parseData(payload);
          onNext(data);
        },
      });
  }
  
function parseData(payload: any): any {
    try {
      return JSON.parse(payload.data);
    } catch (error) {
      console.error("JSON parsing error:", error);
      return null;
    }
  }

function setupRequestStream(
    rsocket: any,
    endpoint: string,
    token?: string,
    onNextMessage?: (message: any) => void
  ) {
    rsocket
      .requestStream({
        metadata: createMetadata(endpoint, token || ""), // token이 없을 경우 빈 문자열로 처리
      })
      .subscribe({
        onComplete: () => console.log("requestStream onComplete"),
        onSubscribe: (subscription:any) => {
          subscription.request(1000);
          console.log("requestStream onSubscribe");
        },
        onError: (error:any) => console.log("requestStream error: ", error),
        onNext: (e: any) => {
          try {
            const message = JSON.parse(e.data);
            console.log("requestStream onNext", message);
            if(onNextMessage)
            {
                onNextMessage(message);
            }
          } catch (error) {
            console.error("JSON parsing error:", error);
          }
        },
      });
  }

function createPayload(message: any): Buffer {
  return Buffer.from(JSON.stringify(message));
}
