import {
  Experiment,
  Variant,
  Variants,
} from '@amplitude/experiment-react-native-client';
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function App() {
  const [variant, setVariant] = React.useState<Variant | undefined>();
  const [fallbackResult, setFallbackResult] = React.useState<
    Variant | undefined
  >();
  const [variantFallbackResult, setVariantFallbackResult] = React.useState<
    Variant | undefined
  >();
  const [payloadVariant, setPayloadVariant] = React.useState<
    Variant | undefined
  >();
  const [allVariants, setAllVariants] = React.useState<Variants | undefined>();
  React.useEffect(() => {
    (async () => {
      if (Experiment) {
        const experiment = Experiment.initialize(
          'client-IAxMYws9vVQESrrK88aTcToyqMxiiJoR',
          {
            debug: true,
            fallbackVariant: { value: 'defaultFallback' },
          },
        );
        await experiment.fetch({
          user_properties: { test: 'true', test2: 4.3 },
        });
        setVariant(experiment.variant('react-native'));
        setFallbackResult(experiment.variant('flag-does-not-exist'));
        setVariantFallbackResult(
          experiment.variant('flag-does-not-exist', {
            value: 'fallback',
            payload: {
              list: [1, 2],
              map: { key: 'value' },
              boolean: true,
              int: 1,
              number: 2.2,
              string: 'string',
            },
          }),
        );
        setPayloadVariant(experiment.variant('android-demo'));
        setAllVariants(experiment.all());
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>react-native: {JSON.stringify(variant)}</Text>
      <Text style={styles.text}>
        'flag-does-not-exist' with no fallback: {JSON.stringify(fallbackResult)}
      </Text>
      <Text style={styles.text}>
        'flag-does-not-exist' with variant fallback:{' '}
        {JSON.stringify(variantFallbackResult)}
      </Text>
      <Text style={styles.text}>
        variant-with-payload: {JSON.stringify(payloadVariant)}
      </Text>
      <Text style={styles.text}>
        all variants: {JSON.stringify(allVariants)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  text: {
    marginVertical: 20,
  },
});
