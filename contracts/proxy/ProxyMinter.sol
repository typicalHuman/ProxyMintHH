// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ProxyOperator {
    function mint(
        address contractAddress,
        bytes calldata _params
    ) external payable;

    function withdraw(
        address contractAddress,
        address to,
        uint256[] calldata tokens
    ) external;
}

interface IERC721 {
    function balanceOf(address owner) external returns (uint256);
}

error MintError();
error WithdrawError();
error InvalidOperatorsCount();

contract ProxyMinter is Ownable {
    function mint(
        address contractAddress,
        address[] calldata operators,
        bytes calldata _params
    ) external payable onlyOwner {
        uint256 operators_count = operators.length;
        uint256 value = msg.value / operators_count;
        for (uint256 i; i < operators_count; ) {
            ProxyOperator(operators[i]).mint{value: value}(
                contractAddress,
                _params
            );
            unchecked {
                ++i;
            }
        }
    }

    function withdraw(
        address contractAddress,
        address to,
        address[] calldata operators,
        uint256[] calldata tokens
    ) external onlyOwner {
        uint256 operators_length = operators.length;
        uint256 tokens_length = tokens.length;
        if (
            operators_length > tokens_length ||
            tokens_length % operators_length != 0
        ) revert InvalidOperatorsCount();
        uint256 tokens_per_operator = tokens_length / operators_length;
        for (uint256 i; i < operators_length; ) {
            uint256 start = i * tokens_per_operator;
            ProxyOperator(operators[i]).withdraw(
                contractAddress,
                to,
                tokens[start:start + tokens_per_operator]
            );
            unchecked {
                ++i;
            }
        }
    }
}
