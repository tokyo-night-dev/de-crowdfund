anvil:
	cd packages/contracts && anvil

deploy:
	cd packages/contracts
	source .env && forge script script/DeployCrowdFunding.s.sol:DeployCrowdFunding --rpc-url $$ANVIL_RPC_URL --private-key $$ANVIL_PRIVATE_KEY --broadcast