
// TOOD replace with your deployed contract address
var address = '';
var abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "chooseWinner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "commit",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_choice",
				"type": "string"
			},
			{
				"name": "_salt",
				"type": "string"
			}
		],
		"name": "reveal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "winner",
				"type": "address"
			}
		],
		"name": "Winner",
		"type": "event"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var choice;
var salt;
var winner;

const updateUI = () => {
    $('#account').text(web3.eth.defaultAccount);
    $('#choice').text(choice);
	$('#salt').text(salt);
	$('#winner').text(winner);
	if (winner == web3.eth.defaultAccount) {
		$('#winner').addClass('win');
	} else {
		$('#winner').removeClass('win');
	}
};

const startApp = () => {

	// create web3 instance
    if (web3 !== undefined) {
        console.log('using injected web3');
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('using ganache:8545');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
	
	// create contract instance
    var contract = web3.eth.contract(abi).at(address);

	// account handling
	web3.eth.defaultAccount  = web3.eth.accounts[0];
    web3.currentProvider.publicConfigStore.on('update', (config) => {
        web3.eth.defaultAccount = config.selectedAddress;
        updateUI();
    });

	updateUI();

	// subscribe to solidity Winner event, report game result
    contract.Winner(function(error, event) {
		if (error) {
			alert(error);
		}
		else {
			winner = event.args.winner;
			updateUI();
		}
	});
	
	// user commit
    $('.hand').click(function() {
        choice = $(this).data('choice');
        if (salt === undefined) {
            salt = Math.random().toString(36).substring(2);
        }

        var combined = choice + salt;
        console.log(combined);
        var hash = keccak_256(combined);
        
        console.log(hash);

        contract.commit('0x' + hash, function(error, txId) {
			if (error) alert(error);
			else alert(txId);
		})

        updateUI();
    });

	// user reveal choice and salt
    $('#reveal').click(function() {
        console.log(`${choice}, ${salt}`);

        contract.reveal(choice, salt, function(error, txId) {
			if (error) alert(error)
			else alert(txId);
		});
    });

	// get game result
    $('#choose-winner').click(function() {
        contract.chooseWinner(function(error) {
			if (error) alert(error);
		});
    });
};

$(document).ready(startApp);
