if (!('webkitSpeechRecognition' in window)) {
  console.log("Sry, Speech API is not supported in this browser");
} else {
  console.log("Speech API is supported");

  var voicecontrol = {};
  var vc = voicecontrol;
  var recognition = new webkitSpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    console.log('Voice recognition started');
  }
  recognition.onerror = function(event) {
    console.log('error:', event);
  }
  recognition.onend = function() {
    console.log('Voice recognition ended');
  }

  function startVoiceRecognition(event) {
    var select_dialect = document.getElementById('select_dialect');
    recognition.lang = select_dialect.value;
    console.log(recognition.lang);

    final_transcript = '';
    recognition.start();
  }

  function stopVoiceRecognition(event) {
    recognition.stop();
  }

  recognition.onresult = function(event) {
    var interim_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        console.log("final: ", final_transcript);
      } else {
        interim_transcript += event.results[i][0].transcript;
        console.log("interim: ", interim_transcript);
        vc.issueCommand(interim_transcript);
      }
    }
  };

  voicecontrol.issueCommand = function (input) {
    var command = vc.parseInput(input);
    console.log("command: ", command);
    vc.obeyCommand(command);
  };

  voicecontrol.obeyCommand = function (command) {
    if (command) {
      if(command == vc.lastCommand) {
        return;
      }
      if (command.ev == 'move') {
        socket.emit(command.ev, {action: command.action, speed: 0.5});
      }
      else {
        socket.emit(command.ev, {action: command.action});
      }
      vc.lastCommand = command;
    }
  }

  voicecontrol.parseInput = function (input) {
    if (input.match(/take/g)) {
      return {ev: 'drone', action: 'takeoff'};
    }
    else if (input.match(/land/g)) {
      return {ev: 'drone', action: 'land'};
    }
    else if (input.match(/stop|die/g)) {
      return {ev: 'drone', action: 'stop'};
    }
    else if (input.match(/up/g)) {
      return {ev: 'move', action: 'up'};
    }
    else if (input.match(/down/g)) {
      return {ev: 'move', action: 'down'};
    }
    else if (input.match(/left/g)) {
      return {ev: 'move', action: 'left'};
    }
    else if (input.match(/right/g)) {
      return {ev: 'move', action: 'right'};
    }
    else if (input.match(/front|forward/g)) {
      return {ev: 'move', action: 'front'};
    }
    else if (input.match(/back/g)) {
      return {ev: 'move', action: 'back'};
    }
    else if (input.match(/flip/g)) {
      return {ev: 'animate', action: 'flipLeft', mode: 'trigger'};
    }
    else if (input.match(/dance/g)) {
      return {action: 'dance'};
    }
    else {
      return false;
    }
  };

  vc.dance = function () {
    // TODO
  }

}
