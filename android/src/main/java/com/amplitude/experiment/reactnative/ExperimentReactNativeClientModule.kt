package com.amplitude.experiment.reactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap

const val MODULE_NAME = "ExperimentReactNativeClient"

@ReactModule(name = MODULE_NAME)
class ExperimentReactNativeClientModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val androidContextProvider = AndroidContextProvider(reactContext.applicationContext, false)

    override fun getName(): String {
        return MODULE_NAME
    }

    @ReactMethod
    private fun getApplicationContext(promise: Promise) {
        promise.resolve(WritableNativeMap().apply {
            putString("version", androidContextProvider.versionName)
            putString("platform", androidContextProvider.osName)
            putString("language", androidContextProvider.language)
            putString("os", androidContextProvider.osName + " "  + androidContextProvider.osVersion)
            putString("device_brand", androidContextProvider.brand)
            putString("device_manufacturer", androidContextProvider.manufacturer)
            putString("device_model", androidContextProvider.model)
            putString("carrier", androidContextProvider.carrier)
        })
    }
}
