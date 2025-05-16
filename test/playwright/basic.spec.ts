// Import Synpress essentials instead of plain Playwright
import basicSetup from "../wallet-setup/basic.setup"; // Import our wallet setup
import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";

// Create a Synpress test instance using Playwright fixtures and our setup
const test = testWithSynpress(metaMaskFixtures(basicSetup));

// Use expect from the Synpress test instance
const { expect } = test;

// Keep the basic title test (optional, but good practice)
test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/TSender/);
});

// The core test for wallet connection and UI change
test("should show the airdrop form when connected, otherwise not", async ({
  page,
  context,
  metamaskPage,
  extensionId,
}) => {
  // The test function now receives Synpress/MetaMask fixtures: context, metamaskPage, extensionId

  await page.goto("/");

  // 1. Verify Initial State (Disconnected)
  // Use a specific locator like getByText or preferably getByTestId if available
  await expect(page.getByText("Please connect")).toBeVisible(); // Check for a disconnected message
  await expect(page.getByText("Token Address")).not.toBeVisible(); // Check that the form element is initially hidden

  // 2. Initiate Connection Process
  // Use getByTestId for robust element selection if your Dapp includes test IDs
  await page.getByTestId("rk-connect-button").click(); // Click your Dapp's connect button

  // Wait for the wallet selection modal (e.g., RainbowKit) and click MetaMask
  // Adjust timeout and locator as needed
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({
    state: "visible",
    timeout: 30000, // Increase timeout if needed
  });
  await page.getByTestId("rk-wallet-option-io.metamask").click();

  // 3. Automate MetaMask Connection using Synpress
  // Instantiate MetaMask helper using provided fixtures
  const metamask = new MetaMask(
    context,
    metamaskPage,
    basicSetup.walletPassword,
    extensionId
  );

  // Synpress handles the popup interaction and approval
  await metamask.connectToDapp();

  // (Optional) Add a custom network if needed for testing (e.g., local Anvil/Hardhat)
  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    symbol: "ETH",
  };
  await metamask.addNetwork(customNetwork);

  // 4. Verify Final State (Connected)
  // Wait for potential asynchronous updates after connection
  await expect(page.getByText("Token Address")).toBeVisible({ timeout: 10000 }); // Check if a form label is now visible
  await expect(page.getByText("Please connect")).not.toBeVisible(); // Check the disconnected message is gone
});
