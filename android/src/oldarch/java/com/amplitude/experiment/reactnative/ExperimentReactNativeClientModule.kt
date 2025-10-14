package com.amplitude.experiment.reactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

class ExperimentReactNativeClientModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val expRnClient = ExperimentReactNativeClientImpl(reactContext)

    @Override
    override fun getName(): String {
        return ExperimentReactNativeClientImpl.NAME
    }

    @ReactMethod
    fun getApplicationContext(promise: Promise) {
        expRnClient.getApplicationContext(promise)
    }
}
