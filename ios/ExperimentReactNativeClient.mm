#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNExperimentReactNativeClientSpec/RNExperimentReactNativeClientSpec.h>
#endif

@interface RCT_EXTERN_MODULE(ExperimentReactNativeClient, NSObject)

RCT_EXTERN_METHOD(getApplicationContext: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
@interface ExperimentReactNativeClient () <NativeExperimentReactNativeClientSpec>
@end
#endif
