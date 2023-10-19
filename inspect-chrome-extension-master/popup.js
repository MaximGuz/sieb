document.getElementById("inspect-btn").addEventListener("click", inspectBtn);
document.getElementById("reload-inspect-btn").addEventListener("click", reloadInspectBtn);
document.getElementById("inspect-ws-select").addEventListener("focus", queryWSList);

chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
		chrome.scripting.executeScript(
				{	
					target: {tabId: tabs[0].id},
					func: initWSList,
				}
		)
});


function queryWSList(){
	
	chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
		chrome.scripting.executeScript(
				{	
					target: {tabId: tabs[0].id, allFrames: true},
					func: getWSOptions,
				},
				(injectionResults) => {
					for (const result of injectionResults){						
						let curOptions = document.getElementsByClassName('mts-inspect-ws-option');
						while(curOptions.length)
							curOptions[0].remove();
						
						
						let el = document.getElementById("inspect-ws-select");
						
						const options = result.result;
						for (let i = 0; i < options.length; i++ ){
							let wsOption = document.createElement('option');
							wsOption.setAttribute('id', options[i]);
							wsOption.setAttribute('value', options[i]);
							wsOption.text = options[i];
							wsOption.setAttribute('class', 'mts-inspect-ws-option');
							
							el.appendChild(wsOption);
						};
					}
				}
		)
	});
}

function initWSList(){
	document.getElementById('mts-inspect-ws-select').click();
}

function inspect(wsName){
	document.getElementById("mts-inspect-ws").value = wsName;
	document.getElementById("mts-inspect-btn").click();
}

function reloadInspect(){
	document.getElementById("mts-inspect-ws").click();
	document.getElementById("mts-inspect-btn").click();
}

function inspectBtn(){
	
	let selWSName = document.getElementById('inspect-ws-select').selectedOptions[0].value;
	chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
		chrome.scripting.executeScript(
				{	
					target: {tabId: tabs[0].id},
					func: inspect,
					args: [selWSName]
				}
		)
	});

}

function reloadInspectBtn(){
	chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
		chrome.scripting.executeScript(
				{	
					target: {tabId: tabs[0].id},
					func: reloadInspect,
				}
		)
	});
}


function getWSOptions(){
	var wsArr = [];
	let options = document.getElementsByClassName('mts-inspect-ws-option');
	for (let i = 0; i < options.length; i++)
		wsArr.push(options[i].getAttribute('value'));
	return wsArr;
	
}
