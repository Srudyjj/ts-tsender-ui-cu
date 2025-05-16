import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright"; // Use Playwright-specific import

// WARNING: Do NOT commit real seed phrases. Use environment variables for secrets.
const SEED_PHRASE =
  "test test test test test test test test test test test junk"; // Example phrase (e.g., from Anvil/Hardhat)
const PASSWORD = "Tester@1234"; // Example password

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  // Synpress uses the context and walletPage from Playwright fixtures
  const metamask = new MetaMask(context, walletPage, PASSWORD);

  // Import the wallet using the defined seed phrase
  await metamask.importWallet(SEED_PHRASE);

  // You can add more setup here, like adding networks or importing tokens
  // await metamask.addNetwork({ name: 'Anvil', rpcUrl: 'http://127.0.0.1:8545', chainId: 31337, symbol: 'ETH' });
});
