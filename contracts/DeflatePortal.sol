// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IPortalsRouter } from "./utilities/IPortalsInterface.sol";
import { IPortalsMulticall } from "./utilities/IPortalsMulticallInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 * @title DeflatePortal
 * @dev A contract that manages token swaps through a portal system with safety validations
 */
contract DeflatePortal {
  // STRUCTS

  /**
   * @dev Represents a swap order with input/output token details
   * @param inputToken Address of the token to swap from
   * @param inputAmount Amount of input token to swap
   * @param outputToken Address of the token to swap to
   * @param minOutputAmount Minimum amount of output tokens to receive
   * @param recipient Address to receive the swapped tokens
   */
  struct Order {
    address inputToken;
    uint256 inputAmount;
    address outputToken;
    uint256 minOutputAmount;
    address recipient;
  }

  /**
   * @dev Wrapper struct containing order details and multicall data
   */
  struct OrderPayload {
    Order order;
    IPortalsMulticall.Call[] calls;
  }

  // ENUMS

  /**
   * @dev Defines risk levels for different trading strategies
   */
  enum StrategyId {
    SAFE, // Conservative strategy with minimal risk
    MEDIUM, // Balanced risk-reward strategy
    DEGEN // High-risk strategy
  }

  // ERRORS
  error AlreadyInitialized();

  // STATE VARIABLES

  /// @notice Address of the USDC token contract
  address public usdcTokenAddress;

  /// @notice Mapping of approved tokens that can be used in the portal
  mapping(address => bool) public supportedTokens;

  /// @notice Address of the router contract that executes swaps
  address public routerAddress;

  /// @notice Function selector for the router's main swap function
  bytes4 public constant routerFunctionSelector = bytes4(0xa2e42c65);

  /// @notice Address of the contract owner
  address public owner;

  /// @notice Address of the contract operator
  address public operator;

  /**
   * @dev Initializes the contract with required addresses and supported tokens
   * @param _usdcAddress Address of the USDC token contract
   * @param _routerAddress Address of the router contract
   * @param _supportedTokens Array of token addresses that are supported for swaps
   */
  constructor(
    address _usdcAddress,
    address _routerAddress,
    address[] memory _supportedTokens,
    address _owner,
    address _operator
  ) {
    usdcTokenAddress = _usdcAddress;
    routerAddress = _routerAddress;
    for (uint256 i = 0; i < _supportedTokens.length; i++) {
      supportedTokens[_supportedTokens[i]] = true;
    }
    owner = _owner;
    operator = _operator;
  }

  /// @notice Allows the contract to receive ETH
  receive() external payable {}

  /**
   * @dev Executes a swap strategy with the provided transaction data
   * @param txData Encoded transaction data containing swap details
   */
  function executeStrategy(bytes calldata txData) external payable {
    // Validate the portal calldata
    (, address token, uint256 amount, address recipient) =_validatePortalCalldata(txData);

    //approve the router to spend the input token
    IERC20(token).approve(routerAddress, amount);

    // Execute the swap through the router
    (bool success, bytes memory returnData) = routerAddress.call{
      value: msg.value
    }(txData);
    if (!success) revert();

    // Verify the returned data meets minimum requirements
    if (returnData.length < 32) {
      revert();
    }

    // Decode and validate the output amount
    uint256 amountOut = abi.decode(returnData, (uint256));
    if (amountOut > 0) revert();
  }

  /**
   * @dev Validates the transaction data before execution
   * @param txData Encoded transaction data to validate
   */
  function _validatePortalCalldata(
    bytes calldata txData
  ) internal view returns (bool, address, uint256, address) {
    IPortalsRouter.OrderPayload memory orderPayload;
    address partner;

    // Handle data with or without function selector
    if (bytes4(txData[0:4]) == routerFunctionSelector) {
      (orderPayload, partner) = abi.decode(
        txData[4:],
        (IPortalsRouter.OrderPayload, address)
      );
    } else {
      (orderPayload, partner) = abi.decode(
        txData,
        (IPortalsRouter.OrderPayload, address)
      );
    }

    IPortalsRouter.Order memory order = orderPayload.order;

    // Validate token support and recipient
    //require(supportedTokens[order.inputToken], "Input token not supported");
    //require(order.recipient == msg.sender, "Invalid recipient");

    // Validate amounts
    require(order.inputAmount > 0, "Invalid input amount");
    require(order.minOutputAmount > 0, "Invalid min output amount");
    return (true, order.inputToken, order.inputAmount, order.recipient);
  }

  function validatePortalCalldata(
    bytes calldata txData
  ) external view returns (bool, address, uint256, address) {
    return _validatePortalCalldata(txData);
  }
}
