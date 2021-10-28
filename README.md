<p align="center">
  <img src="https://xxx-files.ggc.team/oss/rnn-screens/logo.png" width="30%" title="Logo">
</p>

### Install it

```
yarn add @kanzitelli/if-component
```

### Use it

```tsx
import {If} from '@kanzitelli/if-component';

class OrdersScreen = () => {
  return (
    <>
      <If _={loading}
      _then={<LoadingIndicator />}
      _else={<SomethingElse />} />
    </>
  )
}
```

### TS lib starter

```bash
> git clone https://github.com/kanzitelli/if-component rn-lib
> cd rn-lib && rm -rf .git
> yarn
```

Don't forget to change your lib's name in `package.json` and check other scripts.
