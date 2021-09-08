package com.amplitude.experiment.reactnative;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;

import com.amplitude.api.Amplitude;
import com.amplitude.api.AmplitudeAnalyticsProvider;
import com.amplitude.api.AmplitudeClient;
import com.amplitude.api.AmplitudeUserProvider;
import com.amplitude.experiment.Experiment;
import com.amplitude.experiment.ExperimentClient;
import com.amplitude.experiment.ExperimentConfig;
import com.amplitude.experiment.ExperimentUser;
import com.amplitude.experiment.Source;
import com.amplitude.experiment.Variant;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.Nullable;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@ReactModule(name = ExperimentReactNativeClientModule.NAME)
public class ExperimentReactNativeClientModule extends ReactContextBaseJavaModule {

    public static final String NAME = "ExperimentReactNativeClient";
    private static final String TAG = "Experiment";
    private final ReactApplicationContext reactContext;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private ExperimentClient experimentClient;

    public ExperimentReactNativeClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void initialize(String apiKey, ReadableMap config, Promise promise) {
        try {
            ExperimentConfig convertedConfig = convertConfig(config);
            experimentClient = Experiment.initialize(
                (Application) this.reactContext.getApplicationContext(),
                apiKey,
                convertedConfig
            );
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            promise.reject(e);
        }
    }

    @ReactMethod
    public void fetch(ReadableMap user, Promise promise) {
        try {
            ExperimentUser experimentUser = user != null ? convertUser(user) : null;
            Future<ExperimentClient> future = experimentClient.fetch(experimentUser);
            executorService.submit(() -> {
                try {
                    future.get();
                    promise.resolve(true);
                } catch (Exception e) {
                    promise.reject(e);
                }
            });
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setUser(ReadableMap user, Promise promise) {
        try {
            experimentClient.setUser(convertUser(user));
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            promise.reject(e);
        }
    }

    @ReactMethod
    public void variant(String key, Promise promise) {
        try {
            Variant variant = experimentClient.variant(key, null);
            promise.resolve(variantToMap(variant));
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            promise.reject(e);
        }
    }

    @ReactMethod
    public void variantWithFallback(String flagKey, ReadableMap fallback,
                                           Promise promise) {
        try {
            Variant fallbackVariant = new Variant(null, null);
            if (fallback != null) {
                fallbackVariant = new Variant(safeGetString(fallback, "value"),
                        safeGetObject(fallback, "payload"));
            }
            Variant variant = experimentClient.variant(flagKey, fallbackVariant);
            promise.resolve(variantToMap(variant));
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            promise.reject(e);
        }
    }

    @ReactMethod
    public void all(Promise promise) {
        try {
            WritableMap map = new WritableNativeMap();
            Map<String, Variant> variants = experimentClient.all();
            for (Map.Entry<String, Variant> entry : variants.entrySet()) {
                map.putMap(entry.getKey(), variantToMap(entry.getValue()));
            }
            promise.resolve(map);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setAmplitudeUserProvider(String amplitudeInstanceName, Promise promise) {
        try {
            AmplitudeClient amplitudeInstance = Amplitude.getInstance(amplitudeInstanceName);
            if (amplitudeInstance != null) {
                experimentClient.setUserProvider(new AmplitudeUserProvider(amplitudeInstance));
            }
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            promise.reject(e);
        }
    }

    // Conversion methods
    private ExperimentConfig convertConfig(ReadableMap config) {
        ExperimentConfig.Builder builder = ExperimentConfig.builder();
        if (config == null) {
            return builder.build();
        }
        if (config.hasKey("debug")) {
            builder.debug(config.getBoolean("debug"));
        }
        if (config.hasKey("fallbackVariant")) {
            ReadableMap map = config.getMap("fallbackVariant");
            Variant fallbackVariant = new Variant(
                safeGetString(map, "value"),
                safeGetObject(map, "payload")
            );
            builder.fallbackVariant(fallbackVariant);
        }
        if (config.hasKey("initialVariants")) {
            ReadableMap map = config.getMap("initialVariants");
            Map<String, Variant> initialVariants = new HashMap<>();
            for (Iterator<Map.Entry<String, Object>> it = map.getEntryIterator(); it.hasNext(); ) {
                Map.Entry<String, Object> entry = it.next();
                initialVariants.put(entry.getKey(), mapToVariant((ReadableMap) entry.getValue()));
            }
            builder.initialVariants(initialVariants);
        }
        if (config.hasKey("source")) {
            String source = config.getString("source");
            builder.source(Source.valueOf(source));
        }
        if (config.hasKey("serverUrl")) {
            builder.serverUrl(config.getString("serverUrl"));
        }
        if (config.hasKey("fetchTimeoutMillis")) {
            builder.fetchTimeoutMillis(config.getInt("fetchTimeoutMillis"));
        }
        if (config.hasKey("retryFetchOnFailure")) {
            builder.retryFetchOnFailure(config.getBoolean("retryFetchOnFailure"));
        }
        if (config.hasKey("amplitudeUserProviderInstanceName")) {
            String instanceName = config.getString("amplitudeUserProviderInstanceName");
            AmplitudeClient amplitudeInstance = Amplitude.getInstance(instanceName);
            if (amplitudeInstance != null) {
                builder.userProvider(new AmplitudeUserProvider(amplitudeInstance));
            }
        }
        if (config.hasKey("amplitudeAnalyticsProviderInstanceName")) {
            String instanceName = config.getString("amplitudeAnalyticsProviderInstanceName");
            AmplitudeClient amplitudeInstance = Amplitude.getInstance(instanceName);
            if (amplitudeInstance != null) {
                builder.analyticsProvider(new AmplitudeAnalyticsProvider(amplitudeInstance));
            }
        }
        return builder.build();
    }

    @Nullable
    private String safeGetString(ReadableMap map, String key) {
        if (map.hasKey(key)) {
            return map.getString(key);
        }
        return null;
    }

    @Nullable
    private Map<String, Object> safeGetMap(ReadableMap map, String key) {
        if (map.hasKey(key)) {
            return map.getMap(key).toHashMap();
        }
        return null;
    }

    @Nullable
    private Object safeGetObject(ReadableMap map, String key) {
        if (map.hasKey(key)) {
            return ReactNativeHelper.toMap(map).get(key);
        }
        return null;
    }

    private WritableMap variantToMap(Variant variant) {
        WritableMap map = new WritableNativeMap();
        if (variant != null) {
            if (variant.value != null) {
                map.putString("value", variant.value);
            }
            if (variant.payload != null) {
                ReactNativeHelper.putObject(map, "payload", variant.payload);
            }
        }
        return map;
    }

    private Variant mapToVariant(ReadableMap map) {
        return new Variant(safeGetString(map, "value"), safeGetObject(map, "payload"));
    }

    private ExperimentUser convertUser(ReadableMap user) {
        if (user == null) {
            return null;
        }
        ExperimentUser.Builder builder = ExperimentUser.builder();
        builder.deviceId(safeGetString(user, "device_id"))
                .userId(safeGetString(user, "user_id"))
                .version(safeGetString(user, "version"))
                .country(safeGetString(user, "country"))
                .region(safeGetString(user, "region"))
                .dma(safeGetString(user, "dma"))
                .city(safeGetString(user, "city"))
                .language(safeGetString(user, "language"))
                .platform(safeGetString(user, "platform"))
                .os(safeGetString(user, "os"))
                .deviceBrand(safeGetString(user, "device_brand"))
                .deviceManufacturer(safeGetString(user, "device_manufacturer"))
                .deviceModel(safeGetString(user, "device_model"))
                .carrier(safeGetString(user, "carrier"))
                .library(safeGetString(user, "library"))
                .userProperties(safeGetMap(user, "user_properties"));
        return builder.build();
    }
}
