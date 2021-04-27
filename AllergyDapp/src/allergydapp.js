

////////////////////////////////////////////////////////////////////////////////////////
//We create a new MetaMask onboarding object to use in our app
import MetaMaskOnboarding from '@metamask/onboarding'
import Web3 from 'web3'

const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
  ? 'http://localhost:9010'
  : undefined

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

// Dapp Status Section
const networkDiv = document.getElementById('network')
const chainIdDiv = document.getElementById('chainId')
const accountsDiv = document.getElementById('accounts')

// Basic Actions Section
const onboardButton = document.getElementById('connectButton');
const submitButton = document.getElementById('submitButton');
const getAccountsButton = document.getElementById('getAccounts')
const getAccountsResults = document.getElementById('getAccountsResult')

// Form Section
const productName = document.getElementById('productName');
const productID = document.getElementById('productID');
const milk = document.getElementById('milk');
const egg = document.getElementById('egg');
const wheat = document.getElementById('wheat');
const soya = document.getElementById('soya');
const nuts = document.getElementById('nuts');
const shellfish = document.getElementById('shellfish');

  
const initialize = async () => {
	  let onboarding
	  try {
		    onboarding = Metamask.MetaMaskOnboarding
//		    onboarding = MetaMaskOnboarding
	  } catch (error) {
	    console.error(error)
	  }

	  let accounts
	  let allergyContract
	  let accountButtonsInitialized = false
	  
	  const isMetaMaskConnected = () => accounts && accounts.length > 0
	
	  const onClickInstall = () => {
	    onboardButton.innerText = 'Onboarding in progress'
	    onboardButton.disabled = true
	    onboarding.startOnboarding()
	  }
	
	  const onClickConnect = async () => {
	    try {
	      const newAccounts = await ethereum.request({
	        method: 'eth_requestAccounts',
	      })
	      handleNewAccounts(newAccounts)
	    } catch (error) {
	      console.error(error)
	    }
	  }

	  const clearTextDisplays = () => {
		encryptionKeyDisplay.innerText = ''
		encryptMessageInput.value = ''
		ciphertextDisplay.innerText = ''
		cleartextDisplay.innerText = ''
	  }

	  const updateButtons = () => {
		    if (!isMetaMaskInstalled()) {
		      onboardButton.innerText = 'Click here to install MetaMask!'
			  onboardButton.onclick = onClickInstall
			  onboardButton.disabled = false
			} else if (isMetaMaskConnected()) {
			  onboardButton.innerText = 'Connected'
			  onboardButton.disabled = true
			  submitButton.disabled = false
			  if (onboarding) {
			    onboarding.stopOnboarding()
			  }
			} else {
			  onboardButton.innerText = 'Connect'
		      onboardButton.onclick = onClickConnect
		      onboardButton.disabled = false
		    }
	  }
	  
	  const initializeAccountButtons = () => {
		 /**
			 * Contract Interactions
			 */
		
		  
		  submitButton.onclick = async () => {
			  let inputs = {
				  "productName": productName.value,
				  "productID": productID.value,
				  "milk": milk.value,
				  "egg": egg.value,
				  "wheat": wheat.value,
				  "soya": soya.value,
				  "nuts": nuts.value,
				  "shellfish": shellfish.value
			  }
			  
			  console.log(inputs)	
			  
		        try {
		          web3.eth.defaultAccount = ethereum.selectedAddress;
		         
	        	  var abi = [{"constant":false,"inputs":[{"name":"_productName","type":"string"},{"name":"_productID","type":"uint256"},{"name":"_milk","type":"uint256"},{"name":"_egg","type":"uint256"},{"name":"_wheat","type":"uint256"},{"name":"_soya","type":"uint256"},{"name":"_nuts","type":"uint256"},{"name":"_shellfish","type":"uint256"}],"name":"addProductIngredients","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_searchProductbyID","type":"uint256"}],"name":"searchProductIngredients","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dAppPurpose","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
				  var allergydContract = new web3.eth.Contract(abi,
						  '0xa92815Fcf37A1f7Fd6a0AB6d8d97352Bc82611Ad',
						  {
						    from: ethereum.selectedAddress // default from address
						});
	        	  allergydContract.defaultChain= "rinkeby";
	        	  console.log(allergydContract);
	        	    
				
	        	  
	        	  const purposedApp = await allergydContract.methods.dAppPurpose(
					).call()
					.then(function(result){
			        	  console.log(result);
					});
	        	  
	        	  const allergydapp = await allergydContract.methods.addProductIngredients(
							productName.value,
							productID.value,
							milk.value,
							egg.value,
							wheat.value,
							soya.value,
							nuts.value,
							shellfish.value
					).send({from: ethereum.selectedAddress})
					.then(function(result){
			        	  console.log(result);
					});
						
		        } catch (error) {
		        	  console.error(error);
		        }
			  
			
		        
			  
			  
			  ///////////////////////////////////////////////////////////////
		  }
	  }
	  
    getAccountsButton.onclick = async () => {
        try {
          const _accounts = await ethereum.request({
            method: 'eth_accounts',
          })
          getAccountsResults.innerHTML = _accounts[0] || 'Not able to get accounts'
        } catch (err) {
          console.error(err)
          getAccountsResults.innerHTML = `Error: ${err.message}`
        }
      }

	  
	function handleNewAccounts (newAccounts) {
		accounts = newAccounts
		accountsDiv.innerHTML = accounts
		if (isMetaMaskConnected()) {
		  initializeAccountButtons()
		}
		updateButtons()
	}

	  updateButtons()	
	  
	  if (isMetaMaskInstalled()) {

	    ethereum.autoRefreshOnNetworkChange = false
	
	    ethereum.on('accountsChanged', handleNewAccounts)
	
	    try {
	      const newAccounts = await ethereum.request({
	        method: 'eth_accounts',
	      })
	      handleNewAccounts(newAccounts)
	    } catch (err) {
	      console.error('Error on init when getting accounts', err)
	    }
	  }
  
};
	
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("A")
    
} else {
    console.log("B")
    // set the provider you want from Web3.providers
//    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

window.addEventListener('DOMContentLoaded', initialize)

