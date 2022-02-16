/**
 * Defines a user context for evaluation.
 * `device_id` and `user_id` are used for identity resolution.
 * All other predefined fields and user properties are used for
 * rule based user targeting.
 */
export type ExperimentUser = {
  /**
   * Device ID for associating with an identity in Amplitude
   */
  device_id?: string;

  /**
   * User ID for associating with an identity in Amplitude
   */
  user_id?: string;

  /**
   * Predefined field, can be manually provided
   */
  country?: string;

  /**
   * Predefined field, can be manually provided
   */
  city?: string;

  /**
   * Predefined field, can be manually provided
   */
  region?: string;

  /**
   * Predefined field, can be manually provided
   */
  dma?: string;

  /**
   * Predefined field, auto populated via a ExperimentUserProvider
   * or can be manually provided
   */
  language?: string;

  /**
   * Predefined field, auto populated via a ExperimentUserProvider
   * or can be manually provided
   */
  platform?: string;

  /**
   * Predefined field, auto populated via a ExperimentUserProvider
   * or can be manually provided
   */
  version?: string;

  /**
   * Predefined field, auto populated via a ExperimentUserProvider
   * or can be manually provided
   */
  os?: string;

  /**
   * Predefined field, auto populated via a ExperimentUserProvider
   * or can be manually provided
   */
  device_manufacturer?: string;

  /**
   * Predefined field, auto populated via a ExperimentUserProvider
   * or can be manually provided
   */
  device_model?: string;

  /**
   * Predefined field, auto populated via a ExperimentUserProvider
   * or can be manually provided
   */
  device_brand?: string;

  /**
   * Predefined field, can be manually provided
   */
  carrier?: string;

  /**
   * Predefined field, auto populated, can be manually overridden
   */
  library?: string;

  /**
   * Custom user properties
   */
  user_properties?: {
    [propertyName: string]:
      | string
      | number
      | boolean
      | Array<string | number | boolean>;
  };
};

export type Variant = {
  /**
   * The value of the variant.
   */
  value: string;

  /**
   * The attached payload, if any.
   */
  payload?: any;
};

export type Variants = {
  [key: string]: Variant;
};

/**
 * Determines the primary source of variants before falling back.
 *
 * @category Configuration
 */
export enum Source {
  /**
   * The default way to source variants within your application. Before the
   * assignments are fetched, `getVariant(s)` will fallback to local storage
   * first, then `initialVariants` if local storage is empty. This option
   * effectively falls back to an assignment fetched previously.
   */
  LocalStorage = 'LOCAL_STORAGE',

  /**
   * This bootstrap option is used primarily for servers-side rendering using an
   * Experiment server SDK. This bootstrap option always prefers the config
   * `initialVariants` over data in local storage, even if variants are fetched
   * successfully and stored locally.
   */
  InitialVariants = 'INITIAL_VARIANTS',
}

/**
 * @category Configuration
 */
export interface ExperimentConfig {
  /**
   * Debug all assignment requests in the UI Debugger and log additional
   * information to the console. This should be false for production builds.
   */
  debug?: boolean;

  /**
   * The name of the instance being initialized. Used for initializing separate
   * instances of experiment or linking the experiment SDK to a specific
   * instance of the amplitude analytics SDK.
   */
  instanceName?: string;

  /**
   * The default fallback variant for all {@link variant}
   * calls.
   */
  fallbackVariant?: Variant;

  /**
   * Initial values for variants. This is useful for bootstrapping the
   * client with fallbacks and values evaluated from server-side rendering.
   * @see Variants
   */
  initialVariants?: Variants;

  /**
   * Determines the primary source of variants and variants before falling back.
   * @see Source
   */
  source?: Source;

  /**
   * The server endpoint from which to request variants.
   */
  serverUrl?: string;

  /**
   * The request timeout, in milliseconds, when fetching variants.
   */
  fetchTimeoutMillis?: number;

  /**
   * Set to true to retry fetch requests in the background if the initial
   * requests fails or times out.
   */
  retryFetchOnFailure?: boolean;

  /**
   * If true, automatically tracks exposure events though the
   * `ExperimentAnalyticsProvider`. If no analytics provider is set, this
   * option does nothing.
   */
  automaticExposureTracking?: boolean;

  /**
   * This config only matters if you are using the amplitude analytics SDK
   * integration initialized by calling
   * `Experiment.initializeWithAmplitudeAnalytics()`.
   *
   * If true, the client will automatically fetch variants when the
   * user's identity changes. The user's identity includes user_id, device_id
   * and any user properties which are `set`, `unset` or `clearAll`ed via a call
   * to `identify()`.
   *
   * Note: Non-idempotent identify operations `setOnce`, `add`, `append`, and
   * `prepend` are not counted towards the user identity changing.
   */
  automaticFetchOnAmplitudeIdentityChange?: boolean;

  /**
   * Name of the amplitude instance to provide user info.
   *
   * @deprecated Use {@link initializeWithAmplitudeAnalytics} initializer in tandem with the {@link instanceName} config
   */
  amplitudeUserProviderInstanceName?: string;

  /**
   * Name of the amplitude instance to provide analytics tracking.
   *
   * @deprecated Use {@link initializeWithAmplitudeAnalytics} initializer in tandem with the {@link instanceName} config
   */
  amplitudeAnalyticsProviderInstanceName?: string;
}

export interface ExperimentReactNativeClientModule {
  initialize(apiKey: string, config?: ExperimentConfig): Promise<boolean>;
  initializeWithAmplitudeAnalytics(apiKey: string, config?: ExperimentConfig): Promise<boolean>;
  fetch(user?: ExperimentUser): Promise<boolean>;
  setUser(user: ExperimentUser): Promise<boolean>;
  variant(key: string): Promise<Variant>;
  variantWithFallback(key: string, fallback: Variant): Promise<Variant>;
  all(): Promise<Variants>;
  exposure(): Promise<boolean>;
  /**
   * @deprecated use {@link initializeWithAmplitudeAnalytics} to integrate with the amplitude analytics sdk.
   */
  setAmplitudeUserProvider(amplitudeInstanceName?: string): Promise<boolean>;
}
