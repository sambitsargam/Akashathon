import { mainnetId, sandboxId, testnetId } from "../constants";
import * as v1beta3 from "./v1beta3";
export * from "./helpers";

export let deploymentData;
export let selectedNetworkId: string;

export function initDeploymentData() {
  selectedNetworkId = localStorage.getItem("selectedNetworkId") || mainnetId;

  switch (selectedNetworkId) {
    case mainnetId:
    case testnetId:
    case sandboxId:
      deploymentData = v1beta3;
      break;

    default:
      deploymentData = v1beta3;
      break;
  }
}
