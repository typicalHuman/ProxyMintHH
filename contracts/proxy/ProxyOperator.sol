// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IERC721 {
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external;
}

error MintError();

contract ProxyOperator is IERC721Receiver {
    address mainContract;

    constructor(address _mainContract) {
        mainContract = _mainContract;
    }

    fallback() external payable {}

    receive() external payable {}

    function mint(
        address contractAddress,
        bytes calldata _params
    ) external payable onlyMainContract {
        (bool success, ) = contractAddress.call{value: msg.value}(_params);
        if (!success) revert MintError();
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    modifier onlyMainContract() {
        require(msg.sender == mainContract);
        _;
    }

    function withdraw(
        address contractAddress,
        address to,
        uint256[] calldata tokens
    ) external onlyMainContract {
        uint256 tokens_length = tokens.length;
        for (uint256 i; i < tokens_length; ) {
            IERC721(contractAddress).safeTransferFrom(
                address(this),
                to,
                tokens[i]
            );
            unchecked {
                ++i;
            }
        }
    }
}
