const Lookup = require("node-yeelight-wifi").Lookup;

module.exports = LightServer;

function LightServer(){
  EventEmitter.call(this);
}

function LightServer(socket){

	//init
	var _light;
	let look = new Lookup();
	look.findByPortscanning();
	look.on("detected",(light) =>
	{
	    _light = light;
	    console.log("new yeelight detected: id="+light.id + " name="+light.name);

			socket.notify(getLightStatus(light));

	    light.on("stateUpdate",(light) => {
        console.log('stateUpdate!');
	      _light = light;
				socket.notify(getLightStatus(light));
	    });
	});

	function getLightStatus(light){
    var status = '';
		if(light){
			status = {
        power: light.power,
        rgb: light.rgb
      };
		}else {
		  status = {power: false, rgb: {r:255,g:255,b:255}};
		}

    return status;
	}

	socket.on("change",(msg) =>{
    var lightStatus = JSON.parse(msg);

		if(lightStatus.power != null){
			_light.setPower(lightStatus.power, 500);
		}
		if(lightStatus.rgb != null){
			_light.setRGB(lightStatus.rgb, 500);
		}
	});

	socket.on("new", () => {
		socket.notify(getLightStatus(_light));
	})
};
