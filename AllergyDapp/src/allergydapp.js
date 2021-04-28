

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
const searchButton = document.getElementById('searchButton');
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
const sProductID = document.getElementById('sProductID');

//Tabs
const addProductIgredientsTab = document.getElementById('addProductIgredients');
const searchProductIgredientsTab = document.getElementById('searchProductIgredients');

//Tab links
const addLink = document.getElementById('addLink');
const searchLink = document.getElementById('searchLink');

//Table
const searchResultContainer = document.getElementById('searchResult');
const spinner = document.getElementById('spinner');
const loadingText = document.getElementById('loadingText');
const submitText = document.getElementById('submitText');
const addProductModalText = document.getElementById('addProductModalText');

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
			  searchButton.disabled = false
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
			  
			  
        	  spinner.className = spinner.className.replace("visually-hidden", "");
			  loadingText.className = loadingText.className.replace("visually-hidden", "");
			  submitText.setAttribute("class", submitText.getAttribute("class")+ " visually-hidden");
			  submitButton.disabled = true
			  
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
		         
		          var resultModal = new bootstrap.Modal(document.getElementById('resultModal'), {
		        	  keyboard: false
		        	})
		          
		          var abi = [{"constant":false,"inputs":[{"name":"_productName","type":"string"},{"name":"_productID","type":"uint256"},{"name":"_milk","type":"uint256"},{"name":"_egg","type":"uint256"},{"name":"_wheat","type":"uint256"},{"name":"_soya","type":"uint256"},{"name":"_nuts","type":"uint256"},{"name":"_shellfish","type":"uint256"}],"name":"addProductIngredients","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_searchProductbyID","type":"uint256"}],"name":"searchProductIngredients","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dAppPurpose","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
				  var allergydContract = new web3.eth.Contract(abi,
						  '0xa92815Fcf37A1f7Fd6a0AB6d8d97352Bc82611Ad',
						  {
						    from: ethereum.selectedAddress // default from address
						});
	        	  allergydContract.defaultChain= "rinkeby";
	        	  console.log(allergydContract);
	        	    
				
	        	  
	        	  console.log('Purpose');
	        	  const purposedApp = await allergydContract.methods.dAppPurpose(
					).call()
					.then(function(result){
			        	  console.log(result);
					});
	        	  
	        	  console.log('addProductIngredients');
	        	  const addProductIngredients = await allergydContract.methods.addProductIngredients(
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
			        	  addProductModalText.innerHTML = "Το προιόν προστέθηκε!" 
			        	  resultModal.show()
					});
	        	  
						
		        } catch (error) {
		        	  console.error(error);
		        	  addProductModalText.innerHTML = "Αποτυχία προσθήκης!" 
		        	  resultModal.show()
		        }
		        
				submitText.className = submitText.className.replace("visually-hidden", "");
				spinner.setAttribute("class", spinner.getAttribute("class")+ " visually-hidden");
				loadingText.setAttribute("class", loadingText.getAttribute("class")+ " visually-hidden");
				submitButton.disabled = false
			  ///////////////////////////////////////////////////////////////
		  }
		  
		  searchButton.onclick = async () => {
			  let inputs = {
				  "productID": sProductID.value,
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
	        	    
				
	        	  
	        	  console.log('Purpose');
	        	  const purposedApp = await allergydContract.methods.dAppPurpose(
					).call()
					.then(function(result){
			        	  console.log(result);
					});
	        	  
	        	  
	        	  console.log('searchProductIngredients: '+ sProductID.value);
	        	  const searchProductIngredients = await allergydContract.methods.searchProductIngredients(
	        			  sProductID.value,
					).call({from: ethereum.selectedAddress})
					.then(function(result){
			        	  console.log(result);
			        	  
			        	  searchResultContainer.className = searchResultContainer.className.replace("invisible", "visible");
			        	  createTableResults (result)
			        	  
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
	
	function createTableResults (result) {
		  var tBody = document.getElementById("searchResultBody");
		  var child = document.getElementById("searchResultBody").childNodes[0];
	  	  console.log(tBody);
	  	  var tr = document.createElement("tr"); 
	  	  
	  	  var num = document.createElement("th");                       
	  	  var numVal = document.createTextNode("1"); 
	  	  num.setAttribute("scope","row");
	  	  num.appendChild(numVal);                                          
	  	  
	  	  var name = document.createElement("td");                       
	  	  var nameVal = document.createTextNode(result[0]); 
	  	  name.appendChild(nameVal);                                          
	
	  	  var milk = document.createElement("td");                       
	  	  var milkVal = document.createTextNode(result[1]); 
	  	  milk.appendChild(milkVal);                                          
	  	  
	  	  var egg = document.createElement("td");                       
	  	  var eggkVal = document.createTextNode(result[2]); 
	  	  egg.appendChild(eggkVal);  
	  	  
	  	  var wheat = document.createElement("td");                       
	  	  var wheatkVal = document.createTextNode(result[3]); 
	  	  wheat.appendChild(wheatkVal);  
	  	  
	  	  var soya = document.createElement("td");                       
	  	  var soyaVal = document.createTextNode(result[4]); 
	  	  soya.appendChild(soyaVal);  
	  	  
	  	  var nuts = document.createElement("td");                       
	  	  var nutsVal = document.createTextNode(result[5]); 
	  	  nuts.appendChild(nutsVal);  
	  	  
	  	  var shellfish = document.createElement("td");                       
	  	  var shellfishVal = document.createTextNode(result[6]); 
	  	  shellfish.appendChild(shellfishVal);  
	  	  
	  	  tr.appendChild(num);
	  	  tr.appendChild(name);
	  	  tr.appendChild(milk);
	  	  tr.appendChild(egg);
	  	  tr.appendChild(wheat);
	  	  tr.appendChild(soya);
	  	  tr.appendChild(nuts);
	  	  tr.appendChild(shellfish);
	  	  
	  	  if(tBody.hasChildNodes()){
	  		  tBody.replaceChild(tr, tBody.childNodes[0]);
	  	  }else{
		  	  tBody.appendChild(tr);
	  	  }
	  	  

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



