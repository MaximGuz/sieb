/* ibasov 01062022 chrome extension не имеет доступа к переменным типа SiebelApp
   поэтому отрисовыем скрытые элементы DOM, в которых сохраняем результаты обращения к SiebelApp.
   Скрываем через класс mts-inspect-hide из файла mts_inspect.css внедренного в content.js
*/

if("GetBusObj" in SiebelApp.S_App){
	
	// Рисуем элемент с активным WS
	var curWsInput = document.createElement('input');
	curWsInput.setAttribute('id', 'mts-inspect-ws');
	curWsInput.setAttribute('class','mts-inspect-hide');
	curWsInput.onclick = function() {
		const service = SiebelApp.S_App.GetService("Web Engine Client Preferences")
		let ps = SiebelApp.S_App.NewPropertySet();
		let config = {
					async: false,
					cb: function (methodName, inputSet, outputSet) {
							let el = document.getElementById('mts-inspect-ws');
							el.value = outputSet.GetChildByType('ResultSet').GetProperty('WSName');
						}
		};
		service.InvokeMethod("GetActiveWSContext", ps, config);
	}
	document.body.appendChild(curWsInput);

	//Рисуем кнопку запуска Inspect
	var inspectBtn = document.createElement('button');
	inspectBtn.setAttribute('type', 'image');
	inspectBtn.setAttribute('id', 'mts-inspect-btn');
	inspectBtn.setAttribute('class','mts-inspect-hide');
	inspectBtn.onclick=function() {
		
		const service = SiebelApp.S_App.GetService("Workflow Process Manager");
		let ps = SiebelApp.S_App.NewPropertySet();
		ps.SetProperty("ProcessName", "MTS Developer Support - Inspect");
		let el = document.getElementById('mts-inspect-ws');
		ps.SetProperty("sName", el.value);
		let config = {
					  async: false,
					  cb: function (methodName, inputSet, outputSet) {
							let sRes;
							if (outputSet.GetProperty("Status") == "Error") {
									sRes = outputSet.GetChildByType("Errors").GetChild(0).GetProperty("ErrMsg");
							}
							alert(sRes || "WS открыт!");
						}
					};
		service.InvokeMethod("RunProcess", ps, config);
	};		
	document.body.appendChild(inspectBtn);
	
	//Рисуем список Dev WS
	var wsSelect = document.createElement('select');
	wsSelect.setAttribute('id', 'mts-inspect-ws-select');
	wsSelect.setAttribute('class','mts-inspect-hide');
	wsSelect.onclick = function() {
		const service = SiebelApp.S_App.GetService("Workflow Process Manager");
		let ps = SiebelApp.S_App.NewPropertySet();
		ps.SetProperty("ProcessName", "MTS Developer Support - Query WS List");
		let config = {
					async: false,
					cb: function (methodName, inputSet, outputSet) {
							let el = document.getElementById('mts-inspect-ws-select');
							let result = outputSet.GetChildByType("ResultSet");
							if (!result) return;
							
							let wsList = result.GetChildByType("hSM").GetChildByType("ListOfMTS Workspace").GetChildByType("Repository Repository").GetChildByType("ListOfRepository Workspace");
							if(!wsList) return;
							
							let curOptions = document.getElementsByClassName('mts-inspect-ws-option');
							while(curOptions.length)
								curOptions[0].remove();
								
							
							for (let i=0; i < wsList.GetChildCount(); i++){
								
								let wsOption = document.createElement('option');
								let wsName = wsList.GetChild(i).GetProperty('Name');
								wsOption.setAttribute('id', wsName);
								wsOption.setAttribute('value', wsName);
								wsOption.setAttribute('class', 'mts-inspect-ws-option');
								
								el.appendChild(wsOption);
								
							}
								
							
						}
		};
		service.InvokeMethod("RunProcess", ps, config);
	}
	document.body.appendChild(wsSelect);

}

		