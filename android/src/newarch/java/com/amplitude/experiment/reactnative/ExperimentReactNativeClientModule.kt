package com.amplitude.experiment.reactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap

class ExperimentReactNativeClientModule(reactContext: ReactApplicationContext) :
    NativeExperimentReactNativeClientSpec(reactContext) {

    private val expRnClient = ExperimentReactNativeClientImpl(reactContext)

    @Override
    override fun getName(): String {
        return ExperimentReactNativeClientImpl.NAME
    }

    @Override
    override fun getApplicationContext(promise: Promise) {
        expRnClient.getApplicationContext(promise)
    }
}
