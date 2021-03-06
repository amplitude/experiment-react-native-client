import { FetchHttpClient } from '../transport/http';
import { ExposureTrackingProvider } from './exposure';
import { ExperimentUserProvider } from './user';
import { Source } from './source';
import { HttpClient } from './transport';
import { Variant, Variants } from './variant';

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
   * The default fallback variant for all {@link ExperimentClient.variant}
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
   * If true, the `ExperimentClient` will automatically fetch variants when the
   * user's identity changes. The user's identity includes user_id, device_id
   * and any user properties which are `set`, `unset` or `clearAll`ed via a call
   * to `identify()`.
   *
   * Note: Non-idempotent identify operations `setOnce`, `add`, `append`, and
   * `prepend` are not counted towards the user identity changing.
   */
  automaticFetchOnAmplitudeIdentityChange?: boolean;

  /**
   * Sets a user provider that will inject identity information into the user
   * for {@link fetch()} requests. The user provider will only set user fields
   * in outgoing requests which are null or undefined.
   *
   * See {@link ExperimentUserProvider} for more details
   */
  userProvider?: ExperimentUserProvider;

  /**
   * Provides the ability to track exposure events through a 3rd party analytics
   * implementation.
   */
  exposureTrackingProvider?: ExposureTrackingProvider;

  /**
   * (Advanced) Use your own http client.
   */
  httpClient?: HttpClient;
}

/**
 Defaults for Experiment Config options

 | **Option**       | **Default**                       |
 |------------------|-----------------------------------|
 | **debug**        | `false`                           |
 | **instanceName** | `$default_instance` |
 | **fallbackVariant**         | `null`                 |
 | **initialVariants**         | `null`                 |
 | **source** | `Source.LocalStorage` |
 | **serverUrl**    | `"https://api.lab.amplitude.com"` |
 | **assignmentTimeoutMillis**    | `10000` |
 | **retryFailedAssignment**    | `true` |
 | **automaticExposureTracking** | `true` |
 | **automaticFetchOnAmplitudeIdentityChange** | `false` |
 | **userProvider**    | `null` |
 | **analyticsProvider**    | `null` |
 | **exposureTrackingProvider**    | `null` |

 *
 * @category Configuration
 */
export const Defaults: ExperimentConfig = {
  debug: false,
  instanceName: '$default_instance',
  fallbackVariant: {},
  initialVariants: {},
  source: Source.LocalStorage,
  serverUrl: 'https://api.lab.amplitude.com',
  fetchTimeoutMillis: 10000,
  retryFetchOnFailure: true,
  automaticExposureTracking: true,
  automaticFetchOnAmplitudeIdentityChange: false,
  userProvider: null,
  exposureTrackingProvider: null,
  httpClient: FetchHttpClient,
};
