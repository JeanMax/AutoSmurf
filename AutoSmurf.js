/**
*	@filename	AutoSmurf.js
*	@author		JeanMax
*	@desc		Questing, Leveling & Smurfing 
*	@version	1.6b
*/
/*
Special thanks to : Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
For a specific thank, search for your <3
Let me know if I forgot some!
*/


function AutoSmurf() {
 // "use strict";	
	var caveLvl = 6,
		tristLvl = 14,
		tombsLvl = 23,
		diaLvl = 24,
		killBaal = true,
		
		

		
	
	
		
//---------------------------------------be-sure-of-what-you-edit-under-this-line--------------------------------------------//








		wpPicked, patt1, patt2, val, got, preGot, giving, 
		giveWP, pickWP, wpGot, placeToBe, teamBrain, nickTP, 
		nonSorcChar = false,
		questingSorcA = false,
		questingSorcB = false,
		teleportingSorc = false,
		boBarb = false,
		playerCount = false,
		smurfCount = 0,
		boed = 0,
		teamScroll = 0,
		teamFlail = 0,
		teamStaff = 0,
		teamStaff2 = 0,
		boing = 0,
		goBo = 0,
		pick = 0,
		give = 0,
		wait = 0,
		ok = 1,
		mercid = [];
		

//TEAMS
	this.start = function (){
		print("starting");
		
		var w, o, money, tyme, dropX, tpTome, questStuff, coolStuff,
			loop1, loop2, whereIwas;

		for(val=0;val<Math.ceil(Math.E);val+=1){ //assign team
			if (Config.AutoSmurf.NonSorcChar[val] === me.name) {
				nonSorcChar = true;
				break;
			}
			if (Config.AutoSmurf.QuestingSorcA[val] === me.name) {
				questingSorcA = true;
				break;
			}
			if (Config.AutoSmurf.QuestingSorcB[val] === me.name) {
				questingSorcB = true;
				break;
			}
			if (Config.AutoSmurf.TeleportingSorc[val] === me.name) {
				teleportingSorc = true;
				break;
			}
			if (Config.AutoSmurf.BoBarb === me.name) {
				boBarb = true;
				break;
			}
		}
		//moving to last act before party check
		if ( !me.getQuest(7, 0)  && ( me.getQuest(6, 0) || me.getQuest(6, 1)) ){
			Pickit.pickItems();
			this.changeAct(2);
		}
		if (!me.getQuest(15, 0) && me.getQuest(7, 0)) {//if andy done, but not duriel
			Town.goToTown(2);
		}
		if ( !me.getQuest(15, 0)  && (me.getQuest(14, 0) || me.getQuest(14, 1) || me.getQuest(14, 3) || me.getQuest(14, 4)) ){	
			Pickit.pickItems();
			this.changeAct(3);	//getQuest, (14, 0) = completed (talked to meshif), (14, 3) = talked to tyrael, (14, 4) = talked to jerhyn (<3 Imba)
		} 
		if (!me.getQuest(23, 0) && me.getQuest(15, 0) ){//if duriel done, but not meph
			Town.goToTown(3);
		}
		if ( !me.getQuest(23, 0)  && (me.getQuest(22, 0) || me.getQuest(22, 1)) ){
			if((nonSorcChar || boBarb) && me.area === 75){
				say("mephTP");
			}
			this.mephisto();	
		}
		if (!me.getQuest(28, 0) && me.getQuest(23, 0) ){//if meph done, but not diablo
			Town.goToTown(4);
		}
		if ( !me.getQuest(28, 0)  && ( me.getQuest(26, 0) || me.getQuest(26, 1)) ){
			Pickit.pickItems();
			this.changeAct(5);	
			}
		if (me.getQuest(28, 0) ){//if diablo done
			Town.goToTown(5);
		}
		this.clickWP();
		if(boBarb){
			D2Bot.shoutGlobal("request", 69);
		}	
		Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5));
		whereIwas = me.area;
		switch(me.area){
			case 1: 
				if(getWaypoint(8)){
					wpGot = 8;
				}else if(getWaypoint(7)){
					wpGot = 7;
				}else if(getWaypoint(6)){
					wpGot = 6;
				}else if(getWaypoint(5)){
					wpGot = 5;
				}else if(getWaypoint(4)){
					wpGot = 4;
				}else if(getWaypoint(3)){
					wpGot = 3;
				}else if(getWaypoint(2)){
					wpGot = 2;
				}else{
					wpGot = 0;
				}
				break;
			case 40:
				if (!me.getQuest(12, 0)){ //summoner
					if(getWaypoint(16)){
						wpGot = 16;
					}else if(getWaypoint(15)){
						wpGot = 15;
					}else{
						wpGot = 0;
					}
				}else{
					if(getWaypoint(17)){
						wpGot = 17;
					}else{
						wpGot = 0;
					}
				}
				break;
			case 75:
				if ( (!me.getQuest(21, 0) || !me.getQuest(18, 0))  ){ //travincal
					if(getWaypoint(25)){
						wpGot = 25;
					}else if(getWaypoint(24)){
						wpGot = 24;
					}else if(getWaypoint(23)){
						wpGot = 23;
					}else if(getWaypoint(22)){
						wpGot = 22;
					}else if(getWaypoint(21)){
						wpGot = 21;
					}else{
						wpGot = 0;
					}
				}else{
					if(getWaypoint(26)){
						wpGot = 26;
					}else{
						wpGot = 0;
					}
				}
				break;
			default:
				wpGot = 0;
		}

		
		//party check
		for(tyme=0;tyme<400;tyme+=1){
			if(tyme>300 || playerCount){
				quit();
			}
			if(this.playerIn() || this.playerIn(48) ||this.playerIn(2)) { //others players in your area or in bo area
				say("I'm here!");
				break;
			}
		delay(500);
		}
		while(ok !== Config.AutoSmurf.TeamSize) {
			delay(500);
		}
		
		//misc : starting & teams
		if(boBarb && me.charlvl >= 24){ //announce bo
			say("bo");
		}
		if((me.getStat(14) + me.getStat(15)) < Config.LowGold){ //teamGold - ask
			say("GimmeGold");
		}
		if(wpGot !== 0){
			say("WP: Got"+wpGot);
		}
		if(me.getItem(524) || me.getItem(525)){ 	//teamscroll
			say("GotScroll");
		}
		if(me.getItem(92)){ //teamStaff
			say("GotStaff");
		}					
		if(me.getItem(91)){ 	//teamStaff2
			say("GotThePower");
		}	
		if((me.getItem(553)&&me.getItem(554)&&me.getItem(555)) || me.getItem(174)  ){ 	//teamflail
			say("ReadyForTravincal");
		}
		if (me.getItem(555)){ 	//teambrain
			say("GotBrain");
		}	
		delay(me.ping*2+250);	
		if(pickWP === 1){ //picking WP
			say("WP: Gimme"+got);
		}
		if(pick ===1){ //teamGold - pick
			Town.move("stash");
			for (w = 0; w < 20; w += 1) {
				money = getUnit(4, 523, 3);
				delay(1000);	
				if(money){
				Pickit.pickItem(money);
				}
			}
			if (!Town.openStash()) {
				Town.openStash();
			}
		gold(me.getStat(14), 3); //stashing gold
		delay(me.ping);
		me.cancel();
		}	
		if(give ===1 ){ //teamGold - give
			Town.move("stash");
			delay(me.ping *2);
			if (!Town.openStash()) {
				Town.openStash();
				}
			gold(me.getStat(14), 3); //stashing gold
			delay(200);
			for ( dropX = 0; dropX < 2; dropX += 1) {
				if(me.getStat(14) + me.getStat(15) > 2*Config.LowGold){
					gold( Config.LowGold, 4);  //unstashing gold
					delay(me.ping *2+500);
					gold(me.getStat(14));  //droping gold
					delay(me.ping *2+500);
				}
			}
			delay(me.ping);
			me.cancel();
			for ( o = 0; o < 30; o += 1) {
				delay(500);
				money = getUnit(4, 523, 3);
				delay(500);	
				if(!money){
					break;
				}
				if( o > 20 && money){
					Pickit.pickItem(money);
				}
			}
		}
		questStuff = me.getItem(521); //vip amu
		if(!questStuff){
			questStuff = me.getItem(524); //akara scroll
		}
		if(!questStuff){
			questStuff = me.getItem(525); //akara scroll2
		}
		if (questStuff){ 
			if ( questStuff.location !== 7 && Storage.Stash.CanFit(questStuff)) {
				Storage.Stash.MoveTo(questStuff);
				delay(me.ping);
				me.cancel();
			}
		}
		coolStuff = me.getItem(552); //rada book
		if(!coolStuff){
			coolStuff = me.getItem(646); //malah scroll
		}
		if (coolStuff) { 
			if (!Town.openStash()) {
				Town.move("stash");
				Town.openStash();
			}
			clickItem(1, coolStuff);
			delay(me.ping);
			me.cancel();
		}
		
		Town.doChores();
		
		
		if(giveWP === 1){ //giving WP
			Town.move("waypoint");	
			Pather.useWaypoint(placeToBe);
			tpTome = me.findItem("tbk", 0, 3);
			if (tpTome && tpTome.getStat(70)>0) {
				Pather.makePortal();
			}
			for(loop2 = 0 ; loop2 < 180 ; loop2 += 1 ){
				if(wpPicked !== 1){
					delay(1000);
				}else{
					break;
				}
			}
			Pather.useWaypoint(whereIwas);
		}
		if(pickWP === 1){ //picking WP
			Town.move("portalspot");	
			for(loop1 = 0 ; loop1 < 180 ; loop1 += 1 ){
				if(!Pather.usePortal(placeToBe, null)){
					delay(1000);
				}else{
					break;
				}
			}
			this.clickWP();
			say("Thanks Bro!");
			Pather.useWaypoint(whereIwas);
		}

		if(boing ===1 && !boBarb){ //being bo
			this.beBo();
		}
		if(boBarb && me.charlvl >= 24){ //giving bo
			this.giveBo();
		}

		
		if ( ((me.getStat(14) + me.getStat(15) ) < Config.LowGold/10) && me.charlvl > 15){ 
			tpTome = me.findItem("tbk", 0, 3);
			if (!tpTome || !tpTome.getStat(70)) {
				D2Bot.printToConsole("I'm broken :/");	
				print("I'm broken :/");	
				// delay(10000);
			}
		}
		
		return true;
	};
	
	this.giveTP = function (nick) {
		print("giving TP");
		//(<3 kolton)
		
		if (!this.nickList) {
			this.nickList = {};
		}
		if (!this.nickList[nick]) {
			this.nickList[nick] = {
			timer: 0
			};
		}
		
		if (getTickCount() - this.nickList[nick].timer < 60000) {
			say("I can only make one Tp per minute ):");
			return false;
		}
		say("Here you go :)");
		if(me.area !==120){
			if (!Pather.makePortal()) {
				throw new Error("giveTP: Failed to make TP");	
			}	
			this.nickList[nick].timer = getTickCount();
		}
		return true; 
	};
	
	this.chatEvent = function (nick, msg) {
		
		if (nick !== me.name)  { 
			switch (msg) {
				case "Thanks Bro!":
					wpPicked = 1;
					break;
				case "master":			
					say(nick + " is my master.");			
					break;
				case "smurf":				
					say("Smurf!");	
					break;	
				case "WaitMe":			
					wait = 1;			
					break;
				case "hi":					
				case "yo!":					
				case "hello":				
				case "hey":				
					say("yo");		
					break;
				case "I'm here!":
					ok += 1;
					break;
				case "mephTP":
					if(me.area === 103 && !boBarb && !nonSorcChar){
						this.mephisto();
					}
					break;
				case "bo":
					boing =1;
					break;
				case "I'm bored -.-":
					goBo =1;
					break;
				case "I'm Boed!":
					boed+=1;
					break;
				case "Ok Bitch":				
					if( (me.getStat(14) + me.getStat(15) ) < Config.LowGold){
						pick = 1;
					}					
					break;
				case "GimmeGold":
					if( (me.getStat(14) + me.getStat(15) ) > 2*Config.LowGold){
						say("Ok Bitch");
						give = 1;
					}
					break;
				case "TP":	
				case "Tp":		
				case "tp":		
				case "portal":					
				case "tp plz":	
					nickTP = nick;
					this.giveTP(nickTP);
					nickTP = false;
					break;
				case "ReadyForTravincal":	
					teamFlail = 1;
					break;	
				case "GotScroll":	
					teamScroll = 1;
					break;
				case "GotStaff":	
					teamStaff = 1;
					break;
				case "GotThePower":	
					teamStaff2 = 1;
					break;
				case "GotBrain":	
					teamBrain = 1;
				break;
			}
		}
	
		patt1 = new RegExp("WP: Got"); //(<3 QQValpen)
		if(patt1.test(msg) === true){
			preGot = parseInt(msg.substring(7,10), 10);
			if(got){
				if(preGot>got){
					got = preGot;
				}
			}else{
				got = preGot;
			}
			// print(got+">"+wpGot);
			if(got>wpGot){
				pickWP = 1;
			}
			switch(got){
				case 2:
					placeToBe = 4;
					break;
				case 3:
					placeToBe = 5;
					break;
				case 4:
					placeToBe = 6;
					break;
				case 5:
					placeToBe = 27;
					break;
				case 6:
					placeToBe = 29;
					break;
				case 7:
					placeToBe = 32;
					break;
				case 8:
					placeToBe = 35;
					break;
				case 15:
					placeToBe = 52;
					break;
				case 16:
					placeToBe = 74;
					break;
				case 17:
					placeToBe = 46;
					break;
				case 21:
					placeToBe = 78;
					break;
				case 22:
					placeToBe = 79;
					break;
				case 23:
					placeToBe = 80;
					break;
				case 24:
					placeToBe = 81;
					break;
				case 25:
					placeToBe = 83;
					break;
				case 26:
					placeToBe = 101;
					break;
			}
		}
		
		patt2 = new RegExp("WP: Gimme");
		if(patt2.test(msg) === true){
			giving = parseInt(msg.substring(9,12), 10);
			if(giving === wpGot){
				giveWP = 1;
			}
		}
	
	
	
	};	
		
	function ReceiveCopyData(mode, msg) {
		switch (mode) {
			case 69: // request
				if (msg == "request") {
					D2Bot.shoutGlobal("answer", 70);
				}

				break;
			case 70: // Received answer
				if (msg == "answer") {
					smurfCount += 1;
				}

				break;
		}
		if(smurfCount>Math.floor(3*Math.E)){
			playerCount = true;
		}
	};

	this.assemble = function(stuff){
		print("assembling");
	//this is suppose to share the quest items act3
		var h, e, he, ey, i,
			yeh = 0,
			hey = 0;
		
		if(stuff === "eye"){	
			Town.goToTown();
			Town.move("stash");
			this.toInventory();
			e = me.getItem(553);
			e.drop();
			delay(30000);	
			ey = getUnit(4, 553, 3);
			if(ey){
				Pickit.pickItem(ey);
			}
		}
		if(stuff === "heart"){	
			Town.goToTown();
			Town.move("stash");
			this.toInventory();
			h = me.getItem(554);
			h.drop();
			delay(30000);	
			he = getUnit(4, 554, 3);
			if(he){
				Pickit.pickItem(he);
			}
		}
		if(stuff === "brain"){	
			Town.goToTown();
			Town.move("stash");
			for ( i = 0; i < 30; i += 1) {
				ey = getUnit(4, 553, 3);
				if(ey){
					Pickit.pickItem(ey);
					hey=1;
				}
				delay(500);	
				he = getUnit(4, 554, 3);
				if(he){
					Pickit.pickItem(he);
					yeh=1;
				}
				delay(500);	
				if(hey === 1 && yeh ===1){
				say("ReadyForTravincal");
				}
			}
		}
		return true;
	};

	this.playerIn = function (area) {
		if (!area) {
			area = me.area;
		}

		var count = 1,
			party = getParty(); //this is actually counting in game players(you included), not in party

		if (party) {
			do {
				if ( party.area === area ) { //counting players rdy
					count+=1;
				}
			} while (party.getNext());
		}
		
		if ( count < Config.AutoSmurf.TeamSize){
			return false;
		}
			
		return true;
	};
	
	this.teamInGame = function () {

		var count = 1,
			party = getParty(); //this is actually counting in game players(you included), not in party

		if (party) {
			do {
				count+=1;
			} while (party.getNext());
		}
		
		if ( count < Config.AutoSmurf.TeamSize){	
			quit();
			return false;
		}
			
		return true;
	};
	
	this.partyLevel = function (level) {
		
		if (!level) {
			level = me.charlvl;
		}

		var party = getParty();

		if (party) {
			do {
				if ( party.level < level ) { // players not rdy
					return false;
				}
			} while (party.getNext());
		}
		
		return true;
	};

	this.giveBo = function () {
		print("giving bo");
	
		var i, j;
	
		if(!Pather.accessToAct(2)){
			Town.goToTown(1);
			if(!Pather.moveToExit(2, true)){
				if(me.area ===1){
					Town.move("portalspot");
				}else{
					Town.goToTown();
				}
				delay(3000);
				say("tp");
				for (j=0 ; j<20 ; j+=1 ) {
					if(!Pather.usePortal(2, null)){
						delay(500);
					}
					if(me.area === 2){
						break;
					}
				}
			}
		delay(me.ping);
		Packet.teleWalk(me.x, me.y);
		}else{
			if (!getWaypoint(10)) {
				Pather.useWaypoint(40); 
				me.overhead("Smurfing the waypoint");
				Town.move("portalspot");
				while(!Pather.usePortal(48, null)){
					delay(5000);
					say("tp");
					delay(5000);
				}
				Config.ClearType = false;
				this.clickWP();
			}else{
				Pather.useWaypoint(48);
			}
			Pather.moveTo(me.x + rand(1, 5), me.y + rand(1, 5));			
		}


		for (i=0 ; i<3 ; i+=1 ) {
			if ( boed === (Config.AutoSmurf.TeamSize-1) ) {
				break;
			}
			delay(4000);
			Precast.doPrecast(true);
			delay(3000);
		}
		say("I'm bored -.-");
		
		if(!Pather.accessToAct(2)){	
			if(!Pather.moveToExit(1, true)){
				Town.goToTown();
			}
			Town.move("waypoint");
		}else{
			Pather.useWaypoint(40);
		}

		
		return true;
	};

	this.beBo = function () {
		print("being bo");
		
		var i, j, path,
			pathX =[5106, 5205, 5205, 5214, 5222],
			pathY =[5125, 5125, 5152, 5153, 5181];
		
		if(!Pather.accessToAct(2)){
			Town.goToTown(1);
			if(!Pather.moveToExit(2, true)){
				if(me.area ===1){
					Town.move("portalspot");
				}else{
					Town.goToTown();
				}
				delay(3000);
				say("tp");
				for (j=0 ; j<20 ; j+=1 ) {
					if(!Pather.usePortal(2, null)){
						delay(500);
					}
					if(me.area === 2){
						break;
					}
				}
			}
		delay(me.ping);
		Packet.teleWalk(me.x, me.y);
		}else{
			if (!getWaypoint(10)) { 
				Pather.useWaypoint(40); 
				me.overhead("Smurfing the waypoint");
				if(!boBarb && !nonSorcChar){ 
					try{
						for	(path = 0 ; path < pathX.length ; path += 1){
							Pather.moveTo(pathX[path], pathY[path]);
							sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
							delay(me.ping+10);
						}
						Pather.moveToExit([47, 48], true);
					}catch(e){
						print(e);
					}finally{
						if(me.area !== 48){
							if(!me.inTown){
								Town.goToTown();
							}
							Pather.moveToPreset(me.area, 5, 19);
							sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
							Pather.moveToPreset(me.area, 5, 19);
							Pather.useUnit(5, 19);
							Pather.moveToExit([47, 48], true);
						}
					}
					Config.ClearType = false;
					this.clickWP();
					Pather.makePortal();
				}else{ 
					Town.move("portalspot");
					while(!Pather.usePortal(48, null)){
						delay(5000);
						say("tp");
						delay(5000);
					}
					this.clickWP();
				}
			}else{ 
				Pather.useWaypoint(48);
			}
			me.move(me.x + rand(1, 5), me.y + rand(1, 5));		
		}
	
		for (i=0 ; i<60 ; i+=1 ) {
			delay(2000);
			if ( me.getState(32) ) { //shout 26, bo 32
				say("I'm Boed!");
				delay(1000);
				break;	
			}
			if(goBo ===1){
				break;
			}
		}
		while(goBo !== 1){
			delay(1000);
		}
		if(!Pather.accessToAct(2)){
			if(!Pather.moveToExit(1, true)){
				Town.goToTown();
			}
			Town.move("waypoint");
		}else{
			Pather.useWaypoint(40);
			if(!me.inTown){
				Town.goToTown();
			}
		}

		return true;
	};

	
	
//PATHING
	this.travel = function (goal) { //0->9
		print("travel "+goal);
	//this is a custom waypoint getter function
			var k, target, zboub, unit, i, iwasthere,
			wpAreas = [],
			areaIDs = [];
		
		
		switch (goal) {
			case 0:
				zboub = 5;
				wpAreas = [1, 3, 4, 5];
				areaIDs = [2, 3, 4, 10, 5];
				Town.goToTown(1);
				break;
			case 1:
				zboub = 35;
				wpAreas = [1, 3, 4, 5, 6, 27, 29, 32, 35];
				areaIDs = [2, 3, 4, 10, 5, 6, 7, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
				Town.goToTown(1);
				break;
			case 2:
				zboub = 44;
				wpAreas = [40, 48, 42, 57, 43, 44];
				areaIDs = [41, 42, 43, 44];
				Town.goToTown(2);
				break;
			case 3:
				zboub = 74;
				wpAreas = [52, 74];		
				areaIDs = [50, 51, 52, 53, 54, 74];
				Town.goToTown(2);
				break;
			case 4:
				zboub = 46;
				wpAreas = [52, 74, 46];		
				areaIDs = [50, 51, 52, 53, 54, 74, 46];
				Town.goToTown(2);
				break;
			case 5:
				zboub = 83;
				wpAreas = [75, 76, 77, 78, 79, 80, 81, 83];
				areaIDs = [76, 77, 78, 79, 80, 81, 82, 83];
				Town.goToTown(3);
				break;
			case 6:
				zboub = 101;
				wpAreas = [75, 76, 77, 78, 79, 80, 81, 83, 101];
				areaIDs = [76, 77, 78, 79, 80, 81, 82, 83, 100, 101];
				Town.goToTown(3);
				break;
			case 7:
				zboub = 107;
				wpAreas = [103, 106, 107];
				areaIDs = [104, 105, 106, 107];
				Town.goToTown(4);
				break;
			case 8:
				zboub = 118;
				wpAreas = [109, 111, 112, 113, 115, 117, 118];
				areaIDs = [110, 111, 112, 113, 115, 117, 118];
				Town.goToTown(5);
				break;
			case 9:
				zboub = 129;
				wpAreas = [109, 111, 112, 113, 115, 117, 118, 129];
				areaIDs = [110, 111, 112, 113, 115, 117, 118, 120, 128, 129];
				Town.goToTown(5);
				break;
		}
		
		Town.move("waypoint");	
		Pather.getWP(me.area);
		
		target = Pather.plotCourse(zboub, me.area);
		k = areaIDs.indexOf(target.course[0])+1; 
		print(target.course);
	 
		if(k<areaIDs.length) { 
			if (me.inTown && wpAreas.indexOf(target.course[0]) > -1 && getWaypoint(wpAreas.indexOf(target.course[0]))) {
				Pather.useWaypoint(target.course[0], !Pather.plotCourse_openedWpMenu);
			}
			
			for (k ; k < areaIDs.length; k += 1) {
				switch (goal) {
					case 0:
					case 1:
					case 2:
						if(me.diff===0){
							Pather.teleport = false;
						}else{
							Pather.teleport = true;
						}
						break;
					default:
						Pather.teleport = true;
				}
				
				if(Pather.teleport === true && me.charlvl >= 18){
					Config.ClearType = false	;
				}
				
				switch (areaIDs[k]) { //actual goals
					case 100:
					case 101:
					try{
						Pather.moveToExit(areaIDs[k], true, Config.ClearType);
					}catch(e){
						print(e);
						Town.goToTown();
						this.mephisto();
						return true;
					}
						break;
					case 115:
					case 117:
					case 118:
					case 120:
					case 128:
					case 129:
					try{
						Pather.moveToExit(areaIDs[k], true, Config.ClearType);
					}catch(e){
						print(e);
						Town.goToTown();
						Town.move("portalspot");
						delay(10000);
						while(!Pather.usePortal(129, null)){
							delay(5000);
						}
						this.clickWP();
						Pather.moveToExit([128, 120, 118], true, Config.ClearType);
						this.clickWP();
						Pather.moveToExit(117, true, Config.ClearType);
						this.clickWP();
						Pather.moveToExit(115, true, Config.ClearType);
						this.clickWP();
						return true;
					}
						break;
					case 53:// Palace -> palace...
					Pather.moveTo(10109, 6732, 5, Config.ClearType);
					Pather.moveToExit(areaIDs[k], true, Config.ClearType);
						break;
					case 74:// Palace -> Arcane
					Pather.moveTo(10073, 8670, 5, 3, Config.ClearType);
					Pather.usePortal(null);
						break;
					case 46://  Arcane -> Canyon
					try{
						this.summoner();
					}catch(e){
						print(e);
						Town.goToTown();
						Town.move("portalspot");
						delay(10000);
						while(!Pather.usePortal(areaIDs[k], null)){
							delay(10000);
							Pather.usePortal(areaIDs[k]-1, null);
							delay(10000);
						}
						if(me.area === areaIDs[k]-1 ){
							Pather.moveToExit(areaIDs[k], true, Config.ClearType);
						}
						delay(me.ping);
					}finally{
						if(me.area !== areaIDs[k]){
							Town.goToTown();
							Town.move("portalspot");
							delay(10000);
							say("tp");
							while(!Pather.usePortal(areaIDs[k], null)){
								delay(1000);
							}
						}
					}
						break;
					case 110: // Harrogath -> Bloody Foothills
					Pather.moveTo(5026, 5095);
					unit = getUnit(2, 449);// Gate
					if (unit) {
						for (i = 0; i < 10; i += 1) {		
							if (unit.mode === 0) {
								sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);		
							}
							if (unit.mode === 2) {
								break;
							}
							delay(500);
						}
					}
					Pather.moveToExit(areaIDs[k], true, Config.ClearType);
						break;
					default:
					try{
						if(!Pather.moveToExit(areaIDs[k], true, Config.ClearType)){
							if(!Pather.moveToExit(areaIDs[k], true, false)){
								iwasthere = me.area;
								Town.goToTown();
								delay(10000);
								Pather.usePortal(iwasthere, null);
								Pather.moveToExit(areaIDs[k], true, Config.ClearType);
							}
						}
					}catch(e){
						print(e);
						Town.goToTown();
						Town.move("portalspot");
						delay(10000);
						while(!Pather.usePortal(areaIDs[k], null)){
							delay(10000);
							Pather.usePortal(areaIDs[k]+1, null);
							delay(10000);
							Pather.usePortal(areaIDs[k]-1, null);
							delay(10000);
						}
						if(me.area === areaIDs[k]-1 || me.area === areaIDs[k]+1){
							Pather.moveToExit(areaIDs[k], true, Config.ClearType);
						}
						delay(me.ping);
					}finally{
						if(me.area !== areaIDs[k]){
							Town.goToTown();
							Town.move("portalspot");
							delay(10000);
							say("tp");
							while(!Pather.usePortal(areaIDs[k], null)){
								delay(1000);
							}
							
						}
					}
				}
				
				this.clickWP();
		
			}
		}

		Town.goToTown();
		Pather.teleport = false;
		Config.ClearType = 0	;
		return true;
	};

	this.changeAct = function (act) {
		print("change Act"+act);
		
		var npc, time, tpTome,
			preArea = me.area;
		
		if (me.act === act) {
			return true;
		}

		try {
			switch (act) {
			case 2:
				if (me.act >= 2) {
					break;
				}
				Town.move("warriv");
				npc = getUnit(1, "warriv");
				sendPacket(1, 0x31, 4, npc.gid, 4, 183);
				delay(me.ping);
				sendPacket(1, 0x38, 4, 0, 4, npc.gid, 4, 0);
				delay(me.ping);
				break;
			case 3:
				if (me.act >= 3) {
					break;
				}
				Town.move("palace");
				npc = getUnit(1, "jerhyn");
				sendPacket(1, 0x31, 4, npc.gid, 4, 442);
				tpTome = me.findItem("tbk", 0, 3);
				if (tpTome && tpTome.getStat(70)>0) {	
					try{
						Pather.moveToExit(50, true);	
						if(!Pather.usePortal(40, null)){
							if(!me.inTown){
								Town.goToTown();
							}
						}
					}catch(e){
						print(e);
					}finally{
						if(!me.inTown){
							Town.goToTown();
						}
					}
				}
				Town.move("meshif");
				npc = getUnit(1, "meshif");
				sendPacket(1, 0x31, 4, npc.gid, 4, 450);
				delay(me.ping*2);
				sendPacket(1, 0x38, 4, 0, 4, npc.gid, 4, 0);
				delay(me.ping);
				break;
			case 4:
				if (me.act >= 4) {
					break;
				}
				this.mephisto();
				break;
			case 5:
				if (me.act >= 5) {
					break;
				}
				Town.move("tyrael");
				npc = getUnit(1, "tyrael");
				sendPacket(1, 0x31, 4, npc.gid, 4, 20000);
				delay(me.ping);
				sendPacket(1, 0x38, 4, 0, 4, npc.gid, 4, 0);
				delay(me.ping);
				sendPacket(1, 0x40);
				delay(me.ping);
				break;
			}

			delay(1000 + me.ping * 2);

			while (!me.area) {
				delay(500);
			}

			if (me.area === preArea) {
				me.cancel();
				Town.move("portalspot");
				print("Act change failed.");

				return false;
			}

		} catch (e) {
			return false;
		}
		
		for(time=0; time<100 ; time+=1){
			if(this.playerIn()) {
				break;
			}
			if(time>30){
				quit();
			}
		delay(1000);
		}
		return true;
	}; //(<3 Kolton/Imba)

	this.clickWP = function (){
		
		//move to nearest wp and click it
	
		var i, j, k, wp, preset, preArea,
		wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539],
		tob = 0;
	
		for (i = 0; i < wpIDs.length; i += 1) {	
			preset = getPresetUnit(me.area, 2, wpIDs[i]);
			if (preset) {
				print("going to nearest WP");
				try{
					Pather.moveToUnit(preset, 0, 0, Config.ClearType, false);
				}catch(e){
					print(e);
					preArea = me.area;
					Town.goToTown();
					Town.move("portalspot");
					delay(10000);
					say("tp");
					for (k = 0; k < 1000; k += 1) {	
						if(!Pather.usePortal(preArea, null)){
							delay(1000);
						}
						if(k>60){
							return false;
						}
					}
					Pather.moveToUnit(preset, 0, 0, Config.ClearType, false);
				}
				wp = getUnit(2, "waypoint");
				if (wp) {
					if (tob===0){	
					//	say("WP here! :)"); 
						tob=1;
					}
					for ( j = 0; j < 10; j += 1) {
						sendPacket(1, 0x13, 4, wp.type, 4, wp.gid);		
						delay(500);
						if (getUIFlag(0x14)) {
							delay(me.ping);
							me.cancel();
							tob=0;								
							break;
						}
						sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
						delay(me.ping);
						Pather.moveToUnit(preset, 0, 0, Config.ClearType, false);
					}
				}
			}
		}
	return true;
	};
	
	
	
//STUFF	
	this.getQuestItem = function (classid, chestid) {
		print("picking QuestItem");
		
		var chest, item,
			tick = getTickCount();

		if (me.getItem(classid)) {
			return true;
		}
		if (me.inTown) {
			return false;
		}
		chest = getUnit(2, chestid);
		if (!chest) {
			return false;
		}
		Misc.openChest(chest);
		item = getUnit(4, classid);
		if (!item) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}
			return false;
		}
		
		return Pickit.pickItem(item) && delay(1000); //(<3 kolton)
	};

	this.toInventory = function () {
		print("toInventory");
		
		var i,
		items = [],
		item = me.getItem(-1, 0);
		
		if (!Town.openStash()) {
			Town.openStash();
		}
		if (item) {
			do {
				if ( item.classid === 91 || item.classid === 174 || item.classid === 553 || item.classid === 554)	 {
					items.push(copyUnit(item));
				}
			} while (item.getNext());
		}
		for (i = 0; i < items.length; i += 1) {
			if ( Storage.Inventory.CanFit(items[i])) {
				Storage.Inventory.MoveTo(items[i]);
				}
		}
		delay(1000);
		me.cancel();
		
		return true;
	};
	
	this.cubeStaff = function () {
		print("cubing staff");	
		
		var amulet = me.getItem("vip"),
			staff = me.getItem("msf");

		if (!staff || !amulet) {
			return false;
		}
		Town.move("stash");
		if (!Town.openStash()) {
			Town.openStash();
		}
		Storage.Cube.MoveTo(amulet);
		Storage.Cube.MoveTo(staff);
		Cubing.openCube();
		transmute();
		delay(750 + me.ping);
		Cubing.emptyCube();
		me.cancel();
		say("GotThePower");
			
		return true; //(<3 kolton)
	};
	
	this.placeStaff = function () {	
		print("place staff");
		
		var staff, orifice,
			tick = getTickCount(),
			preArea = me.area;
			
		Town.goToTown();
		Town.move("stash");
		this.toInventory();
		Town.move("portalspot");
		if (!Pather.usePortal(preArea, me.name)) {
			throw new Error("placeStaff: Failed to take TP");	
		}
		delay(1000);
		orifice = getUnit(2, 152);
		if (!orifice) {
			return false;
		}
		Misc.openChest(orifice);
		staff = me.getItem(91);
		if (!staff) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}
			return false;
		}
		staff.toCursor();
		submitItem();
		delay(750 + me.ping);

		return true;
	};
	
	this.cubeFlail = function () {
		print("cubing flail");	
		
		var eye = me.getItem(553),
			heart = me.getItem(554),
			brain = me.getItem(555),
			flail = me.getItem(173);

			
		if (!eye || !heart || !brain || !flail) {
			return false;
		}
		Town.move("stash");
		if (!Town.openStash()) {
			Town.openStash();
		}
		Storage.Cube.MoveTo(eye);
		Storage.Cube.MoveTo(heart);
		Storage.Cube.MoveTo(brain);
		Storage.Cube.MoveTo(flail);
		Cubing.openCube();
		transmute();
		delay(750 + me.ping);
		Cubing.emptyCube();
		me.cancel();

		return true;
	};
	
	this.placeFlail = function () {
		print("place flail");
		
		var flail, i, orb,
			preArea = me.area;
		
		Town.goToTown();
		Town.move("stash");
		delay(1000);
		this.toInventory();
		Town.move("portalspot");
		if (!Pather.usePortal(preArea, me.name)) {
				throw new Error("placeFlail: Failed to take TP");	
		}		
		delay(1000);
		orb = getUnit(2, 404);
		if (!orb) {
			return false;
		}
		flail = me.getItem(174);
		if(flail){
			Item.equip(flail, 4); //TODO : be sure it match last kolton's update
		}
		Pickit.pickItems();
		Pather.moveToUnit(orb, 0, 0, Config.ClearType, false);
		for (i = 0; i < 5; i += 1) {
			if(orb){
				Skill.cast(0, 0, orb);
				delay(500);
			}
		}
		
		return true;
	};
	
	this.hireMerc = function(another){ 
		print("hiring merc");
		
		if (another === undefined) {
			another = 0;
		}
		
		var cursorItem, greiz, j, k, l, merc, id;
	
			
		for (l = 0; l < 5; l += 1) {
			merc = me.getMerc();
			if (merc) {
				break;
			}
		delay(100);
		}
		
		if(!merc){
			Town.reviveMerc();
			for (k = 0; k < 5; k += 1) {
				merc = me.getMerc();
				if (merc) {
					break;
				}
			delay(100);
			}
		}
		if(!merc){
			return false;
		}
		
		if(merc.classid !==338 || another === 1){ //act2 merc
			another =0; // :D
			Town.goToTown(2);
			Town.move("greiz");
			Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5));
			Town.move("greiz");
	
			//ok this is a bit stupid
			clickItem(4, 4);
			delay(me.ping + 500);
			if (me.itemoncursor) {
				delay(me.ping + 500);
				cursorItem = getUnit(100);
				if (cursorItem){
					Storage.Inventory.MoveTo(cursorItem);
					delay(me.ping + 1000);
					if (me.itemoncursor) {
						Misc.click(0, 0, me);
						delay(me.ping + 500);
					}
				}
			}
			clickItem(4, 3);
			delay(me.ping + 500);
			if (me.itemoncursor) {
				delay(me.ping + 500);
				cursorItem = getUnit(100);
				if (cursorItem){
					Storage.Inventory.MoveTo(cursorItem);
					delay(me.ping + 1000);
					if (me.itemoncursor) {
						Misc.click(0, 0, me);
						delay(me.ping + 500);
					}
				}
			}
			clickItem(4, 1);
			delay(me.ping + 500);
			if (me.itemoncursor) {
				delay(me.ping + 500);
				cursorItem = getUnit(100);
				if (cursorItem){
					Storage.Inventory.MoveTo(cursorItem);
					delay(me.ping + 500);
					if (me.itemoncursor) {
						Misc.click(0, 0, me);
						delay(me.ping + 500);
					}
				}
			}
			delay(1000);	
			addEventListener("gamepacket", gamePacket);		
			greiz = getUnit(1,"greiz");
			if (!greiz || !greiz.openMenu()) {
				sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
				delay(1000+me.ping);
				Town.move("greiz");
				sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
				greiz = getUnit(1, "greiz");
				greiz.openMenu();
				if (!greiz || !greiz.openMenu()) {
					throw new Error("hireMerc : failed to open npc menu");	
				}
			}
			if(mercid.length) {
				Misc.useMenu(0x0D45);
				sendPacket(1,0x36,4,greiz.gid,4,mercid[Math.floor((Math.random() * mercid.length-1))]);
			}else{
				print("No mercs available");
			}
			delay(1000+me.ping*2);
			me.cancel();
			Pickit.pickItems();
		}
	
		
		return true; //(<3 QQ)
	};

	this.gamePacket = function (bytes) {
		 switch(bytes[0]) {
			case 0x4e:
				var id = (bytes[2] << 8) + bytes[1];
				if(mercid.indexOf(id) !== -1) {
						mercid.length = 0;
				}
				mercid.push(id);
				break;
        }
	};		//(<3 QQ)
	
	
	
	
//QUESTS
	this.den = function () {
		print("den");
		
		this.teamInGame();
		
		var cleartry, akara;
		
		Pather.moveToExit([2, 3], true, Config.ClearType);	
		delay(500);
		this.clickWP();
		Pather.moveToExit([2, 8], true, Config.ClearType);
		for (cleartry = 1; cleartry <= 3; cleartry += 1) {
			if (!me.getQuest(1, 1)){
				print("clearing - try number "+cleartry);
				Attack.clearLevel();
				delay(1000);
			}
		delay(500);
		}
		Pather.moveToExit([2, 1], true, Config.ClearType);
		if(!me.inTown){
			delay(1000);
			sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
			delay(500);
			Pather.moveToExit([2, 1], false);
			Pather.moveToExit([2, 1], true, Config.ClearType);
		}
		if(me.inTown){
			Town.move("akara");
			akara = getUnit(1, "akara");
			akara.openMenu();
			me.cancel();
			delay(1000);
		}
	
		return true;
	};
	
	this.cave = function () {
		print("cave");
		
		Town.doChores();
		Pather.useWaypoint(3);
		Precast.doPrecast(true);
		
		try{
			Pather.moveToExit([9, 13], true, Config.ClearType);
		}catch(e){	
			delay(1000);
		}
		Attack.clearLevel(Config.ClearType);

		return true;
	};

	this.blood = function () {
		print("BloodRaven");
		
		
		this.teamInGame();
		if (!me.getQuest(2, 1)){
			Pather.useWaypoint(3);
			Precast.doPrecast(true);
			Pather.moveToExit(17, true, Config.ClearType);
			try{	
				Pather.moveToPreset(17, 1, 805);
				Attack.kill(getLocaleString(3111)); // Blood Raven
			}catch(e){
				Attack.clear(30);
			}
			Pickit.pickItems();
			Town.goToTown();
		}	
		Town.move("kashya");
		var kashya = getUnit(1, "kashya");
		/*sendPacket(1, 0x38, 4, 3, 4, kashya.gid, 4, 0);
		delay(me.ping);
		sendPacket(1, 0x31, 4, kashya.gid, 4, 92);
		delay(me.ping);
		sendPacket(1, 0x40);
		delay(me.ping);*/
		if (kashya && kashya.openMenu()) {
			me.cancel();
		}
		
	return true;
	};

	this.cain = function () {
		print("cain");
	
		var i, j, akara, cain, slave, tree, scroll, scroll1, scroll2, stoneA, stoneB, stoneC, stoneD, stoneE;
		
		
		this.teamInGame();
		if (!me.getQuest(4, 1) ) {
			this.travel(0);
			if (!me.getQuest(4, 4) && !me.getQuest(4, 3) && !me.getItem(524) && !me.getItem(525) && teamScroll !== 1 ) { //4,4redportal already open ; 4,3 holding scroll
				if(!me.inTown){
				Town.goToTown();
				}
				Pather.useWaypoint(5); //dark wood
				Precast.doPrecast(true);
				Pather.moveToPreset(me.area, 1, 738, 0, 0, Config.ClearType, true); //move to tree
				tree = getUnit(2, 30);
				for (j = 0; j < 3; j += 1) {	
					if(tree){
					sendPacket(1, 0x13, 4, tree.type, 4, tree.gid);		
					delay(200);
					}
				}
				Attack.clear(20); // treehead
				delay(2000);
				scroll = getUnit(4, 524);
				try{	
					Pickit.pickItem(scroll);
				} catch (e) {
					delay(300);
				}
				if(!Pather.usePortal(null, null)){
					Town.goToTown();	
				}
				scroll1 = me.getItem(524);
				if (scroll1){ 
					if ( scroll1.location !== 7 && Storage.Stash.CanFit(scroll1)) {
						Storage.Stash.MoveTo(scroll1);
						delay(me.ping);
						me.cancel();
					}
				}
			}
			Town.move("akara");
			akara = getUnit(1, "akara");
		/*	sendPacket(1, 0x31, 4, akara.gid, 4, 112);
			delay(me.ping);
			sendPacket(1, 0x40);
			delay(me.ping);*/
			if (akara && akara.openMenu()) {
				me.cancel();
			} 
			scroll2 = me.getItem(525);
			if (scroll2){ 
				if ( scroll2.location !== 7 && Storage.Stash.CanFit(scroll2)) {
					Storage.Stash.MoveTo(scroll2);
					delay(me.ping);
					me.cancel();
				}
			}
			this.teamInGame();
			Pather.useWaypoint(4); //stoney field
			Precast.doPrecast(true);
			Pather.moveToPreset(me.area, 1, 737, 0, 0, Config.ClearType, true); 
			try{	
				Attack.clear(15, 0, getLocaleString(2872));// Rakanishu 
			} catch (e) {
				Attack.clear(20);
			}	
			Attack.clear(20);
			if (!me.getQuest(4, 4) ) { 		//redportal already open
				stoneA = getUnit(2, 17);
				stoneB = getUnit(2, 18);
				stoneC = getUnit(2, 19);
				stoneD = getUnit(2, 20);
				stoneE = getUnit(2, 21);
				for (i = 0; i < 5; i += 1) {	
					Misc.openChest(stoneA);
					Misc.openChest(stoneB);
					Misc.openChest(stoneC);
					Misc.openChest(stoneD);
					Misc.openChest(stoneE);
				}
			}	
			for (i = 0; i < 5; i += 1) {
				if (Pather.usePortal(38)) {
					break;
				}
			delay(1000);
			}
			slave = getUnit(2, 26);
			Misc.openChest(slave);
			if(!Pather.usePortal(null, null)){
					Town.goToTown();	
			}
			delay(3000);
		}
		Town.move("akara");
		akara = getUnit(1, "akara");
	/*	sendPacket(1, 0x31, 4, akara.gid, 4, 112);
		delay(me.ping);
		sendPacket(1, 0x40);
		delay(me.ping);*/
		if (akara && akara.openMenu()) {
			me.cancel();
		} 
		Town.move("cain");
		cain = getUnit(1, NPC.Cain);
		if (cain && cain.openMenu()) {
			me.cancel();
		} 
		
		return true;
	};

	this.trist = function () {
		print("trist");

		var coord, i, 
			xx = [ 25175, 25147, 25149, 25127, 25128, 25150, 25081, 25066, 25045, 25061, 25048, 25099, 25109, 25078, 25154],
			yy = [ 5187,  5201,  5172,  5188,  5144,  5123,  5137,  5195,  5186,  5099,  5055,  5058,  5095,  5093,  5095];
		
		Pather.useWaypoint(4);
		Precast.doPrecast(true);
		Pather.moveToPreset(me.area, 1, 737, 0, 0, Config.ClearType, true);
		try{	
			Attack.clear(15, 0, getLocaleString(2872)); // Rakanishu
		} catch (e) {
			Attack.clear(20);
		}	
		for (i = 0; i < 5; i += 1) {
			if (Pather.usePortal(38)) {
				break;
			}	
			delay(1000);
		}

			
		for (coord = 0; coord < xx.length; coord += 1) {
			Pather.moveTo(xx[coord], yy[coord], 3, Config.ClearType);
			Attack.clear(20);
		}

	return true;
	
	};

	this.andy = function () {
		print("killing andy");
			
		this.teamInGame();
		if ( me.getQuest(6, 0) && !me.getQuest(7, 0)){
			this.changeAct(2);
		return true;
		}
		
		if ((!me.getQuest(6, 1)) ) {
			if(!me.inTown){
				Town.goToTown();
			}
			if((!boBarb && !nonSorcChar) || me.diff === 0){
				try{
					this.travel(1);
				} catch (e) {
					Attack.clearLevel();
					Town.goToTown();
					print("travel failed, waiting 3mn");		
					delay(180000);
				}
				Pather.useWaypoint(35);
				Precast.doPrecast(true);

				if(me.diff===0){
					Pather.teleport = false;
				}else{
					Pather.teleport = true;
				}

				if( Pather.teleport === false){
					if(!Pather.moveToExit([36, 37], true, Config.ClearType)){
					Pather.moveToExit([36, 37]);
					}
				}else{
					Pather.moveToExit([36, 37], true);
				}
			}else{
				Town.goToTown(1);
				Town.move("portalspot");	
				while(!Pather.usePortal(37, null)){
					delay(1000);
				}
			}		
			this.teamInGame();
			Precast.doPrecast(true);
			if(me.diff !== 2){
				Pather.teleport = false;
				Pather.moveTo(22594, 9641, 3, Config.ClearType);
				Pather.moveTo(22564, 9629, 3, Config.ClearType);
				Pather.moveTo(22533, 9641, 3, Config.ClearType);
				Pather.moveTo(22568, 9582, 3, Config.ClearType);
				Pather.moveTo(22548, 9568, 3, Config.ClearType);
				Attack.clear(35);
			}else{
				try{
					Attack.kill(156); // Andariel
				}catch(e){
					Attack.clear(20);
				}
			}
			delay(2000); // Wait for minions to die.
			Pickit.pickItems();
			if(!Pather.usePortal(null, null)){
				Town.goToTown();	
			}
		}
		delay(3000);
	//	if (me.getQuest(6, 1)) {
			this.changeAct(2);
	//	}else{
	//		this.andy();
	//	}
		
		return true;
	
	};


	this.rada = function () {
		print("radament");
			
		this.teamInGame();
		
		var book, atma, path, time,
			pathX =[5106, 5205, 5205, 5214, 5222],
			pathY =[5125, 5125, 5152, 5153, 5181];
				
		
		if (!me.getQuest(9, 1) ) {
			Precast.doPrecast(true);
			
			if(  me.diff === 0 ){
				Pather.teleport = false;
				Config.ClearType = 0;
			}
			else{
				Pather.teleport = true;
				Config.ClearType = false;
			}
			Town.goToTown(2);
			Pather.useWaypoint(40, true); 
			if (!getWaypoint(10)) { 
				try{
					for	(path = 0 ; path < pathX.length ; path += 1){
						Pather.moveTo(pathX[path], pathY[path]);
						sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
						delay(me.ping+10);
					}
					Pather.moveToExit([47, 48], true, Config.ClearType);
				}catch(e){
					print(e);
				}finally{
					if(me.area !== 48){
						if(!me.inTown){
							Town.goToTown();
						}
						Pather.moveToPreset(me.area, 5, 19);
						sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
						Pather.moveToPreset(me.area, 5, 19);
						Pather.useUnit(5, 19);
						Pather.moveToExit([47, 48], true, Config.ClearType);
					}
				}
										
				this.clickWP();
			}else{
				Pather.useWaypoint(48, true); 
			}
			Pather.moveToExit(49, true, Config.ClearType);
		
			for(time=0; time<200 ; time+=1){
				if(me.area === 49){
					if(time>180){
						quit();
					}
					if(this.playerIn(49)) { 
						break;
					}
					Pather.moveTo( rand(-10, 10),  rand(-10, 10), 3, Config.ClearType);
				}else{
					Pather.moveToExit(49, true, Config.ClearType); //that let you 180 retry :D
				}
			}
			
			try{	
				Pather.moveToPreset(49, 2, 355, 0, 0, Config.ClearType, true); // Radament 
			} catch (e) {
				Attack.clear(20);
			}	
		
			try{	
				Attack.clear(15, 0, 229); // rada
			} catch (e) {
				Attack.clear(20);
			}	
			//	Attack.kill(229); // Radament -> can be already dead

			book = getUnit(4, 552);
			if (book) {
				try{	
					Pickit.pickItem(book);
					delay(500);
					book = me.getItem(552);
					clickItem(1, book);
				} catch (e) {
					delay(500);
				}
			}
			Town.goToTown();
		}
		Town.move("atma");
		atma = getUnit(1, "atma");
		sendPacket(1, 0x31, 4, atma.gid, 4, 334);
		delay(me.ping);
		Pather.teleport = false;
		Config.ClearType = 0;
		
		return true;
	};

	this.cube = function () {
		print("getting cube");
		
		var i;
		
		
		this.teamInGame();
		this.travel(2);	
		
			
		if(!me.inTown){
			Town.goToTown();
		}
		Pather.useWaypoint(42, true);
		Precast.doPrecast(true);
		if (getWaypoint(12)){
			Pather.useWaypoint(57, true);
		}
		if(me.charlvl < 20){
			Pather.teleport = false;
			Config.ClearType = 0;
		}else{
			Pather.teleport = true;
			Config.ClearType = false;
		}
		
			
		for (i = 0 ; i<3 ; i +=1){
			if(me.area === 42){
				try{
					Pather.moveToExit(56, true, Config.ClearType);
				}catch(e){
					print(e);
					Pather.moveToExit(56, false);
					Pather.moveToExit(56, true, Config.ClearType);
				}
			}
			if(me.area === 56){
				try{
					Pather.moveToExit(57, true, Config.ClearType);
				}catch(e){
					print(e);
					Pather.moveToExit(57, false);
					Pather.moveToExit(57, true, Config.ClearType);
				}
			}
			if(me.area === 57){
				this.clickWP();
				try{
					Pather.moveToExit(60, true, Config.ClearType);
				}catch(e){
					print(e);
					Pather.moveToExit(60, false);
					Pather.moveToExit(60, true, Config.ClearType);
				}
			}
		}
			
		try{	
			Pather.moveToPreset(me.area, 2, 354, 0, 0, Config.ClearType);
		}catch(e){
			Attack.clearLevel();	
		}
		Attack.clear(20);	
		this.getQuestItem(549, 354);
		delay(500);
		if(!Pather.usePortal(null, null)){
			Town.goToTown();	
		}
		Pather.teleport = false;
		
		return true;
	};

	this.amulet = function () {
		print("getting amulet");	
		
		var time, drognan;
			
		this.teamInGame();
		Pather.teleport = false;
		this.travel(2);	
		if(!me.inTown){
			Town.goToTown();
		}
		Pather.useWaypoint(44, true);
		Precast.doPrecast(true);
	
		if(me.diff===0){
			Pather.teleport = false;
			if(me.area === 44){
				try{
					Pather.moveToExit(45, true, Config.ClearType);
				}catch(e){
					print(e);
					Pather.moveToExit(45, false);
					Pather.moveToExit(45, true, Config.ClearType);
				}
			}
			if(me.area === 45){
				try{
					Pather.moveToExit(58, true, Config.ClearType);
				}catch(e){
					print(e);
					Pather.moveToExit(58, false);
					Pather.moveToExit(58, true, Config.ClearType);
				}
			}
			if(me.area === 58){
				this.clickWP();
				try{
					Pather.moveToExit(61, true, Config.ClearType);
				}catch(e){
					print(e);
					Pather.moveToExit(61, false);
					Pather.moveToExit(61, true, Config.ClearType);
				}
			}
			Pather.moveTo(15044, 14045, 3, Config.ClearType);
		}else{
			Pather.teleport = true;
			Config.ClearType = false;
			Pather.moveToExit([45, 58, 61], true);
			Pather.moveTo(15044, 14045, 3);
		}
		this.teamInGame();
		this.getQuestItem(521, 149);
		delay(500);
		if(!Pather.usePortal(null, null)){
			Town.goToTown();	
		}
		if ( me.getItem(521)){
			delay(me.ping);
			if ( Storage.Stash.CanFit(me.getItem(521))) {
				Storage.Stash.MoveTo(me.getItem(521));
			}
			delay(me.ping);
			me.cancel();
		} 
		Town.move("drognan");
		for(time=0; time<200 ; time+=1){
			if(time>60){
				quit();
			}
			if(this.playerIn(40)) { 
				break;
			}
		delay(1000);
		}
		Town.move("drognan");
		drognan = getUnit(1, "drognan");
		drognan.openMenu();
		me.cancel();
		Pather.teleport = false;
		
		return true;
	};

	this.staff = function () {
		print("getting staff");	
	
		this.travel(2);
		
		this.teamInGame();
		if(  me.charlvl	>= 18 ){
			Pather.teleport = true;
		}
	
		if(!me.inTown){
			Town.goToTown();
		}
		Pather.useWaypoint(43, true);
		Precast.doPrecast(true);
			
		if(Pather.teleport === true){
			Pather.moveToExit([62, 63, 64], true);
			Pather.moveToPreset(me.area, 2, 356);
		}else{
			if (!Pather.moveToExit(62, true, Config.ClearType)){
			Pather.moveToExit(62, true, Config.ClearType);
			}
			if (!Pather.moveToExit(63, true, Config.ClearType)){
				Pather.moveToExit(63, true, Config.ClearType);
			}
			if (!Pather.moveToExit(64, true, Config.ClearType)){
				Pather.moveToExit(64, true, Config.ClearType);
			}
			if (!Pather.moveToPreset(me.area, 2, 356, 0, 0, Config.ClearType)){
				Pather.moveToExit([62, 63, 64], true, Config.ClearType);
				Pather.moveToPreset(me.area, 2, 356, 0, 0, Config.ClearType);
			}
		}
		
		this.getQuestItem(92, 356);
		delay(500);
		if(!Pather.usePortal(null, null)){
			Town.goToTown();	
		}
		if ( me.getItem(92)){
			if ( Storage.Stash.CanFit(me.getItem(92))) {
						if(!me.inTown){
						Town.goToTown();
					}
					if ( Storage.Stash.CanFit(me.getItem(92))) {
						Storage.Stash.MoveTo(me.getItem(92));
					}
					delay(me.ping);
					me.cancel();
				}
		} 
						
		Pather.teleport = false;
		
		if (me.getItem(92)){ //teamStaff
			say("GotStaff");
		
		}	
		return true;
	};

	this.summoner = function () {
		print("killing summoner");
		
		
		this.teamInGame();		
	//	if(!me.getQuest(12,0)){
			if(  me.charlvl	>= 18 ){	
				Pather.teleport = true;
				Config.ClearType = false;
			}else{
				Pather.teleport = false;
				Config.ClearType = 0;
			}
			
			if(me.area !== 74){
				if(!me.inTown){
					Town.goToTown();
				}
				Town.move("waypoint");
				Pather.useWaypoint(74, true);
			}
			Precast.doPrecast(true);
			
			var i, journal, a, b,
				preset = getPresetUnit(me.area, 2, 357),
				spot = {};

			switch (preset.roomx * 5 + preset.x) {
				case 25011:
					spot = {x: 25081, y: 5446};
					a = 25081;
					b = 5446;
					break;
				case 25866:
					spot = {x: 25830, y: 5447};
					a = 25830;
					b = 5447;
					break;
				case 25431:
					switch (preset.roomy * 5 + preset.y) {
						case 5011:
							spot = {x: 25449, y: 5081};
							a = 25449;
							b = 5081;
							break;
						case 5861:
							spot = {x: 25447, y: 5822};
							a = 25447;
							b = 5822;
							break;
					}
					break;
			}

			if(Pather.teleport === true){
				Pather.moveTo(a, b, 10);
			}else{
				Pather.moveTo(a, b, 10, Config.ClearType);
				Pather.moveToUnit(spot, 0, 0, Config.ClearType);
			}			
			this.teamInGame();
			try{
				Attack.kill(250);
			}catch(e){
				Attack.clear(20);
			}
			Pickit.pickItems();
			Pather.moveToPreset(me.area, 2, 357, 0, 0, Config.ClearType);
			journal = getUnit(2, 357);
			for (i = 0; i < 5; i += 1) {
				if(journal){
					sendPacket(1, 0x13, 4, journal.type, 4, journal.gid);		
					delay(1000);
					me.cancel();
				}
				if (Pather.getPortal(46)) {
					break;
				}
			}
			if (i === 5) {
				throw new Error("summoner failed");
			}
			Pather.usePortal(46);
	/*	}else{
			Town.goToTown(2);
			Town.move("portalspot");	
			while(!Pather.usePortal(46, null)){
				delay(1000);
			}
		}*/
		this.clickWP();
		Pather.teleport = false;
		
		return true;
	};

	this.tombs = function() {
		print("cleaning tombs");
		
		var i, cain, chest, orifice, player, wherethechest;

		Pather.teleport = false;
		Config.ClearType = 0;
			
		if(!boBarb && !nonSorcChar){
			if(me.area !== 46){
				try{
					if(!me.inTown){
						Town.goToTown();
					}
					Town.move("waypoint");	
					Pather.useWaypoint(46, true);
				} catch (e) {
					this.summoner();
				}
			}
			Pather.makePortal();
		}else{
			Town.goToTown(2);
			while(!Pather.usePortal(46, null)){
				Town.move("cain");
				cain = getUnit(1, "deckard cain");
				if (!cain || !cain.openMenu()) {
						return false;
					}
				me.cancel();
				Town.move("portalspot");	
			}
			this.clickWP();
		}
		Precast.doPrecast(true);

		for (i = 66; i <= 72; i += 1) {
			if(teleportingSorc){
				Pather.moveToExit(i, false, Config.ClearType);
				Pather.makePortal();
				delay(2000);
			}
			Pather.moveToExit(i, true, Config.ClearType);
			for(wherethechest = 0 ;	wherethechest<5 ; wherethechest+=1){
				chest =  getPresetUnit(me.area, 2, 397);
				if(chest){
					break;
				}
				delay(me.ping*2);
			} 
			if(!chest){
				orifice =  getPresetUnit(me.area, 2, 152);
			}
			if(chest && !chest.mode){		
				try{
					Pather.moveToPreset(me.area, 2, 397, 0, 0, Config.ClearType, true);
				}catch(e1){
					print(e1);
					try{
						Pather.moveToPreset(me.area, 2, 397, 0, 0, Config.ClearType, true);
					}catch(e2){
						print(e2);
						player = getUnit(0);
						if (player) {
							do {
								if (player.name !== me.name) {
									Pather.moveToUnit(player, 0, 0, Config.ClearType);
									Attack.clear(20);
									delay(3000);
									//break;
								}
							} while (player.getNext());
						}
					}
				}
			}
			if(orifice){	
				try{
					Pather.moveToPreset(me.area, 2, 152, 0, 0, Config.ClearType, true);
				}catch(e1){
					print(e1);
					try{
						Pather.moveToPreset(me.area, 2, 152, 0, 0, Config.ClearType, true);
					}catch(e2){
						print(e2); //experimental
						player = getUnit(0);
						if (player) {
							do {
								if (player.name !== me.name) {
									Pather.moveToUnit(player, 0, 0, Config.ClearType);
									Attack.clear(20);
									delay(3000);
									//break;
								}
							} while (player.getNext());
						}
					}
				}
			}
			Attack.clear(50);
		//	if(!Pather.moveToExit(46, true, Config.ClearType)){
		//		if(!Pather.moveToExit(46, true)){
					if(!Pather.usePortal(null, null)){
						Town.goToTown();
					}
					delay(me.ping);
					if(!Pather.usePortal(46, null)){
						Town.move("waypoint");	
						Pather.useWaypoint(46);
					}
					
			//	}
		//	}
		}

		return true;
	};

	this.duriel = function () {
		print("killing duriel");
		
		var tyrael, cain, i, count, hole;
		
		
		this.teamInGame();		
		if(me.diff===0 || me.charlvl< 20){
			Pather.teleport = false;
		}else{
			Pather.teleport = true;
		}
			
		if (!me.getQuest(14, 1)  &&  !me.getQuest(14, 3) && !me.getQuest(14, 4)) { 
			if(!me.inTown){
				Town.goToTown();
			}
			
			if(!boBarb && !nonSorcChar){
				Pather.useWaypoint(46, true);
				Precast.doPrecast(true);

				if(  Pather.teleport === true ){	
				Pather.moveToExit(getRoom().correcttomb, true);
				Pather.moveToPreset(me.area, 2, 152, 0, 0, false, true);
				}
				else{
				Pather.moveToExit(getRoom().correcttomb, true, Config.ClearType);
				Pather.moveToPreset(me.area, 2, 152, 0, 0, Config.ClearType, true);
				}
				
				Attack.clear(20);
				Pather.moveToPreset(me.area, 2, 152, 0, 0, false, true);
				Attack.clear(20);
				Pather.moveToPreset(me.area, 2, 152, 0, 0, false, true);
				Attack.clear(20);
				if(!me.getQuest(10, 0)){ //horadric staff
					if ( me.getItem(91)){ 
						this.placeStaff();
					}	
				}
					
					
				for (count = 0; count < 30; count += 1) {
					delay(1000);
					hole =  getUnit(2, 100);
					delay(1000);
					Attack.clear(20);
					if(hole){
						Precast.doPrecast(true);
						Pather.useUnit(2, 100, 73);
						break;
					}
				}
				Pather.makePortal();
			}else{
				Town.goToTown(2);
				while(!Pather.usePortal(73, null)){
					Town.move("cain");
					cain = getUnit(1, "deckard cain");
					if (!cain || !cain.openMenu()) {
							return false;
						}
					me.cancel();
					Town.move("portalspot");	
				}
			}		
			this.teamInGame();
			Attack.clear(35);
			try{
				Attack.kill(211);
			}
			catch(e) {
				print(e);
				Attack.clearLevel();
			}
			Pickit.pickItems();
			Pather.teleport = false;
			Pather.moveTo(22579, 15706);
			Pather.moveTo(22577, 15649, 10);
			Pather.moveTo(22577, 15609, 10);
		
			//talk tyra
			tyrael = getUnit(1, "tyrael");

			if (!tyrael) {
				return false;
			}
			for (i = 0; i < 3; i += 1) {
				if (getDistance(me, tyrael) > 3) {
					Pather.moveToUnit(tyrael);
				}
				sendPacket(1, 0x31, 4, tyrael.gid, 4, 302); 
				delay(me.ping);
			}
			Town.goToTown();
		}	
		
		this.changeAct(3);	
	
		
		return true;
	};

		
	this.figurine = function () {
		print("figurine");
		
		if (!Pather.accessToAct(3)) {
			return false;
		}
	
		var cain, alkor, meshif, potion;
	
			Town.goToTown(3);
		if(!me.getQuest(20, 0)){
			if(me.getItem(546)){ //ajadefigurine
				Town.move("cain");
				cain =  getUnit(1, "deckard cain");
				cain.openMenu();
				me.cancel();
				Town.move("meshif");
				meshif = getUnit(1, "meshif");
				meshif.openMenu();
				me.cancel();
				Town.move("cain");
				cain =  getUnit(1, "deckard cain");
				cain.openMenu();
				me.cancel();
			}
			if(me.getItem(547)){
				Town.move("cain");
				cain =  getUnit(1, "deckard cain");
				cain.openMenu();
				me.cancel();
				Town.move("alkor");
				alkor = getUnit(1, "alkor");
				alkor.openMenu();
				me.cancel();
			}
			if(me.getQuest(20, 1)){
				Town.move("cain");
				cain =  getUnit(1, "deckard cain");
				cain.openMenu();
				me.cancel();
				Town.move("alkor");
				alkor = getUnit(1, "alkor");
				alkor.openMenu();
				me.cancel();
			}
			if(me.getItem(545)){
				potion = getUnit(4, 545);
				if (potion) {
					clickItem(1, potion);
				}
			}
		}
	
		return true;
	};

	this.lamEssen = function () { 
		print("lam essen");

		var  alkor; 

		
		this.teamInGame();
		Town.goToTown(3);
		Town.move("alkor");
		alkor = getUnit(1, "alkor");
		if (alkor) {
				sendPacket(1, 0x31, 4, alkor.gid, 4, 564); //FREE QUEST! (<3 Imba)
				delay(me.ping);
		}
				
		return true;
	};
	
	this.eye = function () {
		print("getting eye");
		
		
		this.teamInGame();
		if(!me.inTown){
			Town.goToTown();
		}
		if(  me.charlvl	>= 18 ){	
			Pather.teleport = true;
		}
		Pather.useWaypoint(76, true);
		Precast.doPrecast(true);
				
		if(Pather.teleport === true){
			Pather.moveToExit(85, true);
			if(me.area !== 85){
				var units = getPresetUnits(me.area, 5, 51),
					unit = units[1];
				Pather.moveToUnit(unit, true);
				Pather.useUnit(5, 51);
			}
			Pather.moveToPreset(me.area, 2, 407);
		}else{
			Pather.moveToExit(85, true, Config.ClearType);
			if(!Pather.moveToPreset(me.area, 2, 407, 0, 0, Config.ClearType)){
				Pather.moveToPreset(me.area, 2, 407);
			}
		Attack.clear(20);	
		}
			
		this.getQuestItem(553, 407);
		delay(300);
		Town.goToTown();
		delay(500);
		if ( me.getItem(553)){
			if(!me.inTown){
				Town.goToTown();
			}
			if ( Storage.Stash.CanFit(me.getItem(553))) {
				Storage.Stash.MoveTo(me.getItem(553));
			}
			delay(me.ping);
			me.cancel();
		}
		delay(500);
		Pather.teleport = false;
		
		return true;
	};

	this.heart = function () {
		print("getting heart");
		
		
		this.teamInGame();
		if(  me.charlvl	>= 18 ){
			Pather.teleport = true;
		}
		if(!me.inTown){
			Town.goToTown();
		}
		Pather.useWaypoint(80, true);
		Precast.doPrecast(true);
				
		if(Pather.teleport === true){
			Pather.moveToExit([92, 93], true);
			Pather.moveToPreset(me.area, 2, 405);
		}else{
			Pather.moveToExit([92, 93], true, Config.ClearType);
			if(!Pather.moveToPreset(me.area, 2, 405, 0, 0, Config.ClearType)){
				Pather.moveToPreset(me.area, 2, 405);
			}
		Attack.clear(20);	
		}
			
		this.getQuestItem(554, 405);
		delay(300);
		Town.goToTown();
		delay(500);
		if ( me.getItem(554)){
			if(!me.inTown){
				Town.goToTown();
			}
			if ( Storage.Stash.CanFit(me.getItem(554))) {
				Storage.Stash.MoveTo(me.getItem(554));
			}
			delay(me.ping);
			me.cancel();
		}
		delay(500);
		Pather.teleport = false;
		
		return true;
	};
	
	this.brain = function () {
		print("getting brain");
		
		
		this.teamInGame();
		if(  me.charlvl	>= 18 ){	
			Pather.teleport = true;
		}
		if(!me.inTown){
			Town.goToTown();
		}
		Pather.useWaypoint(78, true);
		Precast.doPrecast(true);
				
		if(Pather.teleport === true){
			Pather.moveToExit([88, 89, 91], true);
			try{	
				Pather.moveToPreset(me.area, 2, 406);
			}catch(e){
				print(e);
				Attack.clearLevel();
			}
		}else{
			Pather.moveToExit([88, 89, 91], true, Config.ClearType);
			try{	
				if(!Pather.moveToPreset(me.area, 2, 406, 0, 0, Config.ClearType)){
					Pather.moveToPreset(me.area, 2, 406);
				}
			}catch(e){
				print(e);
				Attack.clearLevel();
			}	
		Attack.clear(20);	
		}
			
		this.getQuestItem(555, 406);
		delay(300);
		Town.goToTown();
		delay(500);
		if ( me.getItem(555)){
			if(!me.inTown){
				Town.goToTown();
			}
			if ( Storage.Stash.CanFit(me.getItem(555))) {
				Storage.Stash.MoveTo(me.getItem(555));
			}
			delay(me.ping);
			me.cancel();
		}
		delay(500);
		Pather.teleport = false;
		
		return true;
	};
	
	this.travincal = function () {
		print("travincal");
				
		var  orgX, orgY, cain, preArea;
		
		
		this.teamInGame();
	
		if(me.diff===0){
			Pather.teleport = false;
		}else{
			Pather.teleport = true;
		}
		

		this.buildList = function (checkColl) {
			var monsterList = [],
				monster = getUnit(1);

			if (monster) {
				do {
					if ([345, 346, 347].indexOf(monster.classid) > -1 && Attack.checkMonster(monster) && (!checkColl || !checkCollision(me, monster, 0x1))) {
						monsterList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			return monsterList;
		};
		
		Town.goToTown();
		Town.move("cain");
		cain = getUnit(1, "deckard cain");
		if (!cain || !cain.openMenu()) {
			return false;
		}
		me.cancel();
		if(!boBarb && !nonSorcChar){
			Pather.useWaypoint(83);
			Pather.makePortal();
		}else{
			Town.goToTown(3);
			Town.move("portalspot");	
			while(!Pather.usePortal(83, null)){
				delay(1000);
			}
		}
		Pather.teleport = false;
		Precast.doPrecast(true);
		orgX = me.x;
		orgY = me.y;
		Pather.moveTo(orgX + 101, orgY - 56, 5, Config.ClearType);	//(<3 kolton)
		
		if(me.diff===0){
			Pather.teleport = false;
		}else{
			Pather.teleport = true;
		}
		this.teamInGame();
		Attack.clearList(this.buildList(0));
		Pickit.pickItems();
		
		if (me.getItem(553) && me.getItem(554) && me.getItem(555)  && me.getItem(173) ){
			preArea = me.area;
			if(!me.inTown){
				Town.goToTown();
			}
			this.cubeFlail();
			if(me.inTown){
				Town.move("portalspot");	
				if (!Pather.usePortal(preArea, me.name)) { // this part is essential
					throw new Error("travincal: Failed to go back from town");
				}
			}
		}
		if (!me.getQuest(18, 0) && me.getItem(174)) {
			Config.PacketCasting = 1;
			this.placeFlail();
		}

		return true;
	};
	
	this.mephisto = function () {
		print("mephisto");
		
		
		// this.teamInGame();
		Pather.teleport = true;
		var cain, time;
		
		if(!boBarb && !nonSorcChar){
			try{
				if ( (me.getStat(14) + me.getStat(15) ) > Config.LowGold/10 ){ 
					Pather.useWaypoint(101);
					Precast.doPrecast(true);
					Pather.moveToExit(102, true);
					Pather.moveTo(17566, 8069);
					Pather.makePortal();
				}else{
					Town.goToTown(3);
					Town.move("cain");
					cain = getUnit(1, "deckard cain");
					if (!cain || !cain.openMenu()) {
						return false;
					}
					Town.move("portalspot");
					say("mephTP");				
					while(!Pather.usePortal(102, null)){
						delay(10000);
					}
				}
			}catch(e){
				print(e);
				Town.goToTown(3);
				Town.move("portalspot");
				say("mephTP");				
				while(!Pather.usePortal(102, null)){
					delay(10000);
				}
				
			}
		}else{
			Town.goToTown(3);
			while(!Pather.usePortal(102, null)){
				Town.move("cain");
				cain = getUnit(1, "deckard cain");
				if (!cain || !cain.openMenu()) {
					return false;
				}
				me.cancel();
				Town.move("portalspot");	
				delay(10000);
			}
		}
		if (!me.getQuest(22, 0)) {		
			this.teamInGame();
			if(!Attack.kill(242)){ 
				Attack.clear(20);
			}
			Pickit.pickItems();
		}
		Pather.moveTo(17590, 8068);
		delay(1500);
		Pather.moveTo(17601, 8070);
		Pather.usePortal(null);
		for(time=0; time<90 ; time+=1){
			if(this.playerIn()) {
				break;
			}
		delay(1000);
		}
		if(!this.playerIn()) {
			quit();
		}
		Pather.teleport = false;
		
		return true;
	};


	this.izual = function () {
		print("izual");
		
		var tyrael;
		
		
		this.teamInGame();
		
		Pather.teleport = true;	
		if (!me.getQuest(25, 1)) {
			if(questingSorcA){
			
				Town.goToTown();
				Precast.doPrecast(true);
				Config.ClearType = false;
				Pather.moveToExit([104, 105], true, Config.ClearType);
				Pather.makePortal();
			}else{
				Town.goToTown(4);
				Town.move("portalspot");	
				while(!Pather.usePortal(105, null)){
					delay(1000);
				}
				Config.ClearType = 0;
			}
			Pather.moveToPreset(105, 1, 256, 0, 0, Config.ClearType, true);
			Config.ClearType = 0;		
			this.teamInGame();
			try{
				if(!Attack.clear(15, 0, 256)){ // izu
					Attack.clear(20);
				}
			} catch (e) {
				Attack.clear(20);
			}	
			Town.goToTown();
		}
		Town.move("tyrael");
		tyrael = getUnit(1, "tyrael");
		tyrael.openMenu();
		me.cancel();
		Pather.teleport = false;
		
		return true;
	};

	this.diablo = function () {
		print("diablo");
		//(<3 kolton)	
		this.teamInGame();
		// Sort function
		this.sort = function (a, b) {
			// Entrance to Star / De Seis
			if (me.y > 5325 || me.y < 5260) {
				if (a.y > b.y) {
				return -1;
				}
			return 1;
			}
			// Vizier
			if (me.x < 7765) {
				if (a.x > b.x) {
					return -1;
				}
			return 1;
			}
			// Infector
			if (me.x > 7825) {
				if (!checkCollision(me, a, 0x1) && a.x < b.x) {
					return -1;
				}
			return 1;
			}

		return getDistance(me, a) - getDistance(me, b);
		};

		// general functions
		this.getLayout = function (seal, value) {
			var sealPreset = getPresetUnit(108, 2, seal);

			if (!seal) {
				throw new Error("Seal preset not found. Can't continue.");
			}
			if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
				return 1;
			}
		return 2;
		};

		this.initLayout = function () {
			this.vizLayout = this.getLayout(396, 5275);
			this.seisLayout = this.getLayout(394, 7773);
			this.infLayout = this.getLayout(392, 7893);
		};

		this.openSeal = function (classid) {
			var i, seal;

			for (i = 0; i < 5; i += 1) {
				Pather.moveToPreset(me.area, 2, classid, classid === 394 ? 5 : 2, classid === 394 ? 5 : 0, Config.ClearType, false);
				seal = getUnit(2, classid);
				if (!seal) {
					return false;
				}
				if (seal.mode) { 
					return true;
				}
				sendPacket(1, 0x13, 4, seal.type, 4, seal.gid);		
				delay(classid === 394 ? 1000 : 500);

				if (!seal.mode) {
					if (classid === 394 && Attack.validSpot(seal.x + 15, seal.y)) { // de seis optimization
						Pather.moveTo(seal.x + 15, seal.y, 3, Config.ClearType);
					} else {
						Pather.moveTo(seal.x - 5, seal.y - 5, 3, Config.ClearType);
					}delay(500);
				} else {
				return true;
				}
			}

		return false;
		};

		this.getBoss = function (name) {
			var i, boss,
				glow = getUnit(2, 131);

			for (i = 0; i < 16; i += 1) {
				boss = getUnit(1, name);
				if (boss) {
					return Attack.clear(40, 0, name, this.sort);
				}
			delay(250);
			}

		return !!glow;
		};

		this.vizierSeal = function () {
			print("Viz layout " + this.vizLayout);
			this.followPath(this.vizLayout === 1 ? this.starToVizA : this.starToVizB);
			try{
				this.openSeal(395);
			} catch (e){
				delay(200);
			}
			try{
				this.openSeal(396);
			} catch (e){
				delay(200);
			}
			if (this.vizLayout === 1) {
				Pather.moveTo(7691, 5292, 5, Config.ClearType);
			} else {
				Pather.moveTo(7695, 5316, 5, Config.ClearType);
			}if (!this.getBoss(getLocaleString(2851))) {
				this.getBoss(getLocaleString(2851));
			}

		return true;
		};

		this.seisSeal = function () {
			print("Seis layout " + this.seisLayout);
			this.followPath(this.seisLayout === 1 ? this.starToSeisA : this.starToSeisB);
			try{
				this.openSeal(394);
			} catch (e){
				delay(200);
			}
			if (this.seisLayout === 1) {
				Pather.moveTo(7771, 5196, 5, Config.ClearType);
			} else {
				Pather.moveTo(7798, 5186, 5, Config.ClearType);
			}
			if (!this.getBoss(getLocaleString(2852))) {
				this.getBoss(getLocaleString(2852));
			}

		return true;
		};

		this.infectorSeal = function () {
			print("Inf layout " + this.infLayout);
			this.followPath(this.infLayout === 1 ? this.starToInfA : this.starToInfB);
			try{
				this.openSeal(392);
			} catch (e){
				delay(200);
			}
			if (this.infLayout === 1) {
				delay(1);
			} else {
				Pather.moveTo(7928, 5295, 5, Config.ClearType);// temp
			}
			if (!this.getBoss(getLocaleString(2853))) {
				this.getBoss(getLocaleString(2853));
			}
			try{
				this.openSeal(393);
			} catch (e){
				delay(200);
			}

		return true;
		};

		this.diabloPrep = function () {
			var trapCheck,
				tick = getTickCount();

			while (getTickCount() - tick < 30000) {
				if (getTickCount() - tick >= 8000) {
					switch (me.classid) {
					case 1: // Sorceress
						if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
							if (me.getState(121)) {
								delay(500);
							} else {
								Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
							}
							break;
						}
						delay(500);
						break;
					case 3: // Paladin
						Skill.setSkill(Config.AttackSkill[2]);
						Skill.cast(Config.AttackSkill[1], 1);
						break;
					case 5: // Druid
						if (Config.AttackSkill[1] === 245) {
							Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
							break;
						}
						delay(500);
						break;
					case 6: // Assassin
						if (Config.UseTraps) {
							trapCheck = ClassAttack.checkTraps({x: 7793, y: 5293});
							if (trapCheck) {
								ClassAttack.placeTraps({x: 7793, y: 5293, classid: 243}, trapCheck);
								break;
							}
						}
						delay(500);
						break;
					default:
						delay(500);
						break;
					}
				} else {
					delay(500);
				}
				if (getUnit(1, 243)) {
					return true;
				}
			}

		throw new Error("Diablo not found");
		};

		this.followPath = function (path) {
			var i,
				cleared = [];

			for (i = 0; i < path.length; i += 2) {
				if (cleared.length) {
					this.clearStrays(cleared);
				}
				Pather.moveTo(path[i], path[i + 1], 5, Config.ClearType);
				Attack.clear(30, 0, false, this.sort);
				// Push cleared positions so they can be checked for strays
				cleared.push([path[i], path[i + 1]]);
				// After 5 nodes go back 3 nodes to check for monsters
				if (i === 10 && path.length > 16) {
					path = path.slice(6);
					i = 0;
				}
			}
		};

		this.clearStrays = function (cleared) {
			var i,
				unit = getUnit(1);

			if (unit) {
				do {
					if (Attack.checkMonster(unit)) {
						for (i = 0; i < cleared.length; i += 1) {
							if (getDistance(unit, cleared[i][0], cleared[i][1]) < 30 && Attack.validSpot(unit.x, unit.y)) {
								Pather.moveToUnit(unit, 0, 0, Config.ClearType);
								Attack.clear(20, 0, false, this.sort);
								break;
							}
						}
					}
				} while (unit.getNext());
			}

		return true;
		};

		// path coordinates
		this.entranceToStar = [7794, 5490, 7769, 5484, 7771, 5423, 7782, 5413, 7767, 5383, 7772, 5324];		
		this.starToVizA = [7766, 5306, 7759, 5295, 7734, 5295, 7716, 5295, 7718, 5276, 7697, 5292, 7678, 5293, 7665, 5276, 7662, 5314];
		this.starToVizB = [7766, 5306, 7759, 5295, 7734, 5295, 7716, 5295, 7701, 5315, 7666, 5313, 7653, 5284];
		this.starToSeisA = [7772, 5274, 7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7775, 5205, 7804, 5193, 7814, 5169, 7788, 5153];
		this.starToSeisB = [7772, 5274, 7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7811, 5218, 7807, 5194, 7779, 5193, 7774, 5160, 7803, 5154];
		this.starToInfA = [7815, 5273, 7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5295, 7919, 5290];
		this.starToInfB = [7815, 5273, 7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5274, 7927, 5275, 7932, 5297, 7923, 5313];

		// start
		
		
		Pather.teleport = true;
		if(teleportingSorc){
			Pather.useWaypoint(107);
			Precast.doPrecast(true);
			Config.ClearType = false;
			Pather.moveTo(7790, 5544);
			Pather.makePortal();
		}else{
			Town.goToTown(4);
			Town.move("portalspot");
			Precast.doPrecast(true);			
			while(!Pather.usePortal(108, null)){
				delay(500);
			}
		}
		Attack.clear(10);
		Pather.teleport = false;
		Config.ClearType = 0;
		this.initLayout();
		Attack.clear(30, 0, false, this.sort);
			Precast.doPrecast(true);
		this.followPath(this.entranceToStar);
		//Pather.moveTo(7791, 5293, 5, Config.ClearType);
		//Pather.makePortal();
		Attack.clear(30, 0, false, this.sort);
		this.vizierSeal();
		this.seisSeal();
		Precast.doPrecast(true);
		Pather.teleport = true;
		this.infectorSeal();
		if(!this.partyLevel(diaLvl)){
			quit();
		}
		this.teamInGame();
		Pather.moveTo(7788, 5292, 5, Config.ClearType);
		this.diabloPrep();
		try{
			Attack.kill(243);
		}catch(e){
			print(e);
			Town.goToTown();
			delay(20000);
		}
		Pickit.pickItems();
		Pather.teleport = false;
		delay(2000);
		
		return true;
	};
	
	
	this.shenk = function () {
		print("shenk");
			
		this.teamInGame();
		if (me.getQuest(35, 1)) {
			return true;
		}
		if (!Town.goToTown() || !Pather.useWaypoint(111, true)) {
			throw new Error();
		}
		Precast.doPrecast(true);
		Config.ClearType = 0;
		Pather.moveTo(3883, 5113, 5, Config.ClearType);
		Pather.moveTo(3922, 5120, 5, Config.ClearType);
		try{
			Attack.kill(getLocaleString(22435)); // Shenk the Overseer
		}catch(e){
			print(e);
		}
		Town.goToTown();
		
		return true;
	};

	this.rescueBarbs = function(){ //TODO : be sure the door is "killed"
		print("coming barbies");
	//(<3 Larryw)
		var i, j, k, qual, door,
			coords =[],
			barbSpots = [];
		
		this.teamInGame();
		if(!me.getQuest(36,1)){
			Pather.teleport = true;
			Pather.useWaypoint(111, true);
			Precast.doPrecast(true);	
			barbSpots = getPresetUnits (me.area, 2, 473);
			
			if (!barbSpots) {
				return false;
			}
			for ( i = 0  ; i < barbSpots.length ; i += 1) {
				coords.push({
					x: barbSpots[i].roomx * 5 + barbSpots[i].x,
					y: barbSpots[i].roomy * 5 + barbSpots[i].y
				});
			}
				
			for ( k = 0  ; k < coords.length ; k += 1) {
			print("going to barbspot "+(k+1)+"/"+barbSpots.length);
			Pather.moveToUnit(coords[k], 2, 0);
			door = getUnit(1, 434);
				if (door) {
					Pather.moveToUnit(door, 1, 0);
					for (j = 0; j < 6; j += 1) {
						Skill.cast(Config.AttackSkill[2], 0, door);
						delay(50);
					}
				}
			}
			delay(1000);
			Town.goToTown();
		}
		Town.move("qual-kehk");
		delay(1000+me.ping);
		qual = getUnit(1, "qual-kehk");
		if(qual){
			qual.openMenu();
			me.cancel();
			delay(500);
		}
		Pather.teleport = false;
		
		return true;
	};
	
	this.anya = function () {
		print("anya");
		
		var anya, malah, scroll, unit, waitAnya;
		

		this.teamInGame();		
		if (!me.getQuest(37, 1)) {
			
			Town.move("malah");
			malah = getUnit(1, "malah");
			if(malah){
				sendPacket(1, 0x31, 4, malah.gid, 4, 20127); //FREE POT!(<3 Imba)
				delay(me.ping);
				sendPacket(1, 0x40);
				delay(me.ping);
			}
			if ( me.getItem(644) || me.getItem(646) ){ //pot/scroll
				if (!Town.openStash()) {
					Town.openStash();
				}
				if ( me.getItem(644)){
					if ( Storage.Stash.CanFit(me.getItem(644))) {
						Storage.Stash.MoveTo(me.getItem(644));
					}
				}
				if ( me.getItem(646)){
					if ( Storage.Stash.CanFit(me.getItem(646))) {
						Storage.Stash.MoveTo(me.getItem(646));
					}
				}
				delay(me.ping);
				me.cancel();
			}
			Pather.useWaypoint(113, true);
			Precast.doPrecast(true);
			Pather.teleport = true;
			Config.ClearType = false;
			try{
				Pather.moveToExit(114, true, Config.ClearType);
			}catch(e){
				print(e);
			}
			if(me.area!==114){
				try{
					Pather.moveToExit(114, true, Config.ClearType);
				}catch(e){
					print(e);
				}
			}	
			this.teamInGame();
			unit = getPresetUnit(me.area, 2, 460);
			Pather.moveToUnit(unit, true);
			delay(me.ping+850);
			sendPacket(1, 0x31, 4, 0xffffffff, 4, 20131);
			delay(me.ping+50);
			anya = getUnit(2, 558);
			if(anya){
				sendPacket(1, 0x13, 4, anya.type, 4, anya.gid);		
			}
			//sendPacket(1, 0x13, 4, 2, 4, 0xffffffff);
		//	delay(me.ping+50);
			me.cancel();
			Town.goToTown();
			Town.move("malah");
			malah = getUnit(1, "malah");
			malah.openMenu();
			me.cancel();
		}
		Town.goToTown(5);
		scroll = me.getItem(646);
		if (scroll) {
			clickItem(1, scroll);
		}
		anya = getUnit(1, "anya");
		Town.move("anya");
		if(!anya){
			for (waitAnya=0 ; waitAnya<30 ; waitAnya+=1){
				delay(1000);
				anya = getUnit(1, "anya");
				if(anya){
					break;
				}
			}
		}
		if(anya){
			Town.move("anya");
			anya.openMenu();
			me.cancel();
		}
		
		return true;
	};

	this.ancients = function () {
		print("ancients");
	
		var altar, time;
		
		this.teamInGame();
		Pather.teleport = true;
		if(teleportingSorc){
			Pather.useWaypoint(118, true);
			Pather.moveToExit(120, false);
			Pather.makePortal();
		}else{
			Town.goToTown(5);
			Town.move("portalspot");	
			while(!Pather.usePortal(118, null)){
				delay(10000);
			}
		}
		Precast.doPrecast(true);
		Pather.teleport = true;
		
		try{
			Pather.moveToExit(120, true);
		}catch(e){
			print(e);
		}
		
		if(me.area !==120){
			if(!me.inTown){
				Town.goToTown();
			}
			Town.move("portalspot");	
			delay(10000);
			while(!Pather.usePortal(118, null)){ //(118, !me.name) ??
				delay(1000);
			}
			try{
				Pather.moveToExit(120, true);
			}catch(e){
				print(e);
			}
		}
		Pather.moveTo(10048, 12622, 5, Config.ClearType);
			this.teamInGame();
		Config.LifeChicken = 0; // Exit game if life is less or equal to designated percent.
		Config.TownHP = 0; // Go to town if life is under designated percent.
		Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
		Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.
		Config.TownMP = 0; // Go to town if mana is under designated percent.
		Config.TownCheck = false; // Go to town if out of potions
		Pather.teleport = true;					
		altar = getUnit(2, 546);
		for(time=0; time<80 ; time+=1){
			if(this.playerIn() || wait === 1) {
				break;
			}
		delay(1000);
		}
	
		if (altar) {
			Pather.moveToUnit(altar);
			say("WaitMe");
			sendPacket(1, 0x31, 4, altar.gid, 4, 20002);
			sendPacket(1, 0x13, 4, altar.type, 4, altar.gid);
			delay(100);
			me.cancel();
		}
	//	(altar.mode !== 2) { we probably don't give a damn
		while (!getUnit(1, 542)) {
			delay(250);
		}
		Attack.clear(50);
		Pather.moveTo(10089, 12622);
		delay(3000);
		me.cancel();
		if(boBarb || nonSorcChar){
			// Pather.makePortal();	
			if (!Pather.usePortal(null, me.name)) {
				Town.goToTown();
			}
		}else{
			Config.ClearType = false;
			Pather.moveToExit([128, 129], true);
			this.clickWP();
			Town.goToTown();
		}
		wait = 0;
		Pather.teleport = false;
		
		return true;
	};

	this.baal = function () {
		print("baal");
	//(<3 YGM)	
		this.teamInGame();
	var portal, tick, baalfail, questTry, time, l, merc,
		quest = false;

		this.preattack = function () {
			var check;

			switch (me.classid) {
			case 1: // Sorceress
				switch (Config.AttackSkill[1]) {
				case 49:
				case 53:
				case 56:
				case 59:
				case 64:
					if (me.getState(121)) {
						while (me.getState(121)) {
							delay(100);
						}
					} else {
						return Skill.cast(Config.AttackSkill[1], 0, 15090 + rand(-5, 5), 5026);
					}

					break;
				}

				break;
			case 3: // Paladin
				if (Config.AttackSkill[3] === 112) {
					if (Config.AttackSkill[4] > 0) {
						Skill.setSkill(Config.AttackSkill[4], 0);
					}

					return Skill.cast(Config.AttackSkill[3], 1);
				}

				break;
			case 5: // Druid
				if (Config.AttackSkill[3] === 245) {
					return Skill.cast(Config.AttackSkill[3], 0, 15094 + rand(-1, 1), 5028);
				}

				break;
			case 6: // Assassin
				if (Config.UseTraps) {
					check = ClassAttack.checkTraps({x: 15094, y: 5028});

					if (check) {
						return ClassAttack.placeTraps({x: 15094, y: 5028}, 5);
					}
				}

				if (Config.AttackSkill[3] === 256) { // shock-web
					return Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
				}

				break;
			}

			return false;
		};

		this.checkThrone = function () {
			var monster = getUnit(1);

			if (monster) {
				do {
					if (Attack.checkMonster(monster) && monster.y < 5080) {
						switch (monster.classid) {
						case 23:
						case 62:
							return 1;
						case 105:
						case 381:
							return 2;
						case 557:
							return 3;
						case 558:
							return 4;
						case 571:
							return 5;
						default:
							Attack.getIntoPosition(monster, 10, 0x4);
							Attack.clear(15);

							return false;
						}
					}
				} while (monster.getNext());
			}

			return false;
		};

		this.clearThrone = function () {
			var i, monster,
				monList = [],
				pos = [15094, 5022, 15094, 5041, 15094, 5060, 15094, 5041, 15094, 5022];

			//avoid dolls
				monster = getUnit(1, 691);

				if (monster) {
					do {
						if (monster.x >= 15072 && monster.x <= 15118 && monster.y >= 5002 && monster.y <= 5079 && Attack.checkMonster(monster) && Attack.skipCheck(monster)) {
							monList.push(copyUnit(monster));
						}
					} while (monster.getNext());
				}

				if (monList.length) {
					Attack.clearList(monList);
				}
			

			for (i = 0; i < pos.length; i += 2) {
				Pather.moveTo(pos[i], pos[i + 1]);
				Attack.clear(25);
			}
		};

		this.checkHydra = function () {
			var monster = getUnit(1, "hydra");
			if (monster) {
				do {
					if (monster.mode !== 12 && monster.getStat(172) !== 2) {
						if(teleportingSorc || questingSorcA){
							Pather.moveTo(15072, 5002);
						}else {
							Pather.moveTo(15118, 5002);
						}
						while (monster.mode !== 12) {
							delay(500);
							if (!copyUnit(monster).x) {
								break;
							}
						}

						break;
					}
				} while (monster.getNext());
			}

			return true;
		};
	
		//Town.doChores();
		for(questTry = 0 ; questTry < 10 ; questTry +=1 ){
			if(me.getQuest(40,0)){
				quest = true;
				break;
			}
			delay(100);
		}
			Pather.teleport = true;
		if(teleportingSorc){
			try{
				Pather.useWaypoint(129);
			}catch(e){
				print(e);
				Town.goToTown();
				for(baalfail = 0; baalfail < 10; baalfail =+1){
					if(!Pather.usePortal(131, null)){
						delay(1000);
					}
					if(!Pather.usePortal(129, null)){
						delay(1000);
					}
					if(me.area === 131){
						Pather.moveToExit([130, 129], true);
						this.clickWP();
						break;
					}
					if(me.area === 129){
						this.clickWP();
						break;
					}
					delay(10000);
					if(baalfail === 8){
						D2Bot.printToConsole("I'm broken :/");
					}
				}
				
				
			}
			if(!this.partyLevel(28)){
				Pather.makePortal();
			}
		}else{
			Town.goToTown(5);
			Town.move("portalspot");
			if(this.partyLevel(28)){
				while(!Pather.usePortal(131, null)){
					delay(500);
				}
			}else{
				while(!Pather.usePortal(129, null)){
					delay(500);
				}
			}
		}
		
		//teleporting
		if(teleportingSorc && this.partyLevel(28)){
			Pather.moveToExit([130, 131], true);
			//Pather.moveTo(15121, 5237);
			Pather.moveTo(15095, 5029);
			Pather.moveTo(15118, 5002);
			Pather.makePortal();
		}
	
		//walking		
		if(!this.partyLevel(28)){
			Pather.teleport = false;
			Precast.doPrecast(true);
			try{
				Pather.moveToExit(130, true, Config.ClearType);
				if (me.area !== 130) {
					Pather.teleport = true;
					Pather.moveToExit(130, true);
					Pather.teleport = false;
				}	
				Pather.moveToExit(131, true, Config.ClearType);
				if (me.area !== 131) {
					Pather.teleport = true;
					Pather.moveToExit(131, true);
					Pather.teleport = false;
				}
			}catch(e){
					if(!boBarb && !nonSorcChar){
						Pather.teleport = true;
						Town.goToTown();
						Pather.useWaypoint(129);
						Precast.doPrecast(true);
						Pather.moveToExit([130, 131], true);
						Pather.teleport = false;
					}else{
						Town.goToTown();
						Town.move("portalspot");	
						while(!Pather.usePortal(131, null)){
							delay(1000);
						}
					}
			}
			Pather.moveTo(15095, 5029, 5, Config.ClearType);
		}
		
		
		Pather.teleport = true;
		Attack.clear(15);
		this.clearThrone();
		tick = getTickCount();
		Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038, 5, Config.ClearType);
		Precast.doPrecast(true);

	BaalLoop:
		while (true) {
		//	if (getDistance(me, 15094, me.classid === 3 ? 5029 : 5038) > 3) {
		//		Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
		//	}
			if(me.classid ===3 || me.classid === 4){
				Pather.moveTo(15094, 5029);
			}else if(teleportingSorc){
				Pather.moveTo(15094, 5038);
			}else if(questingSorcA){
				Pather.moveTo(15088, 5039);
			}else if(questingSorcB){
				Pather.moveTo(15100, 5038);
			}
			if (!getUnit(1, 543)) {
				break BaalLoop;
			}

			switch (this.checkThrone()) {
			case 1:
				Attack.clear(40);

				tick = getTickCount();

				Precast.doPrecast(true);

				break;
			case 2:
				Attack.clear(40);

				tick = getTickCount();

				break;
			case 3:
				Attack.clear(40);
				this.checkHydra();

				tick = getTickCount();

				break;
			case 4:
			
				Attack.clear(40);

				tick = getTickCount();

				break;
			case 5:
				Attack.clear(40);		
				if(me.charlvl === 69 && me.diff === 1){
					for (l = 0; l < 5; l += 1) {
						merc = me.getMerc();
						if (merc) {
							break;
						}
					delay(100);
					}
					if(merc){
						if(!merc.getState(43)){
							Town.goToTown();
							this.hireMerc(1);
							delay(60000);
							quit();
						}
					}		
				}
				break BaalLoop;
			default:
				if (getTickCount() - tick < 7e3) {
					if (me.getState(2)) {
						Skill.setSkill(109, 0);
					}

					break;
				}

				if (!this.preattack()) {
					delay(100);
				}

				break;
			}

			delay(10);
		}

		sendPacket(1, 0x40);
		delay(me.ping*2);
		
		if(killBaal === false){
			return true;
		}
		
		this.teamInGame();
		for(questTry = 0 ; questTry < 10 ; questTry +=1 ){
			if(me.getQuest(40,0)){
				quest = true;
				break;
			}
			delay(100);
		}
		
		if(!quest){
			Config.QuitList = [];
		}
		Pather.moveTo(15090, 5008, 5, Config.ClearType);
		delay(5000);
		Precast.doPrecast(true);
		while (getUnit(1, 543)) {
			delay(500);
		}
		portal = getUnit(2, 563);
		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Baal: Couldn't find portal.");
		}
		for(time=0; time<200 ; time+=1){
			if(time>30){
				quit();
			}
			if(this.playerIn()) { 
				break;
			}
		delay(1000);
		}
		Pather.moveTo(15134, 5923);
		try{
			Attack.kill(544); // Baal
		}catch(e){
			delay(10000);
			print(e);
		}
		Pickit.pickItems();
		delay(2000);
		if(!quest){
			Config.QuitList = [];
			say("Restart");
			delay(30000);
			D2Bot.restart(); //avoid congrat screen
		}
		
		Pather.teleport = false;
		
		return true;
	};
	
		

		
				
//MAIN
	addEventListener("chatmsg", this.chatEvent);
	addEventListener("copydata", ReceiveCopyData);
	this.start();

	//act1	
	if (!me.getQuest(7, 0) ){
		Town.goToTown(1);
		//den
		if (!me.getQuest(1, 0) ) {
			this.den();
		}
		if(me.diff === 0){
			//cave
			if (!me.getQuest(2, 0) && me.getQuest(1, 0) && me.charlvl	<= caveLvl ) {
				this.cave();	
			}
			//blood raven
			if (!me.getQuest(2, 0) && me.getQuest(1, 0) && me.charlvl	> caveLvl) {
				this.blood();	
			}
			//cain
			if (!me.getQuest(4, 0) && me.charlvl	> caveLvl) {
				this.cain();
			}
			//trist
			if (me.getQuest(4, 0) && me.charlvl	<= tristLvl) {	
				this.trist();	
			}
		}
		//andy	
		if (!me.getQuest(7, 0) && ((me.charlvl	>= tristLvl && me.diff === 0) || (me.diff !== 0))){			
			this.andy();
		}
	}	
		
	//act2
	if (!me.getQuest(15, 0) && me.getQuest(7, 0)) {//if andy done, but not duriel
		Town.goToTown(2);
		//cube
		if (!me.getItem(549) && me.diff === 0){
			this.hireMerc();
			this.cube();
			if (!me.getItem(549) ){ //recursive retry...
				this.cube();
			}
		}
		//amu
		if (!me.getQuest(11, 0)) {	//actually only amulet is needed to tomb :O	
					this.amulet();			
		}	
		if(!boBarb && !nonSorcChar){	//sorc
			//sumo&rada	
			if (!me.getQuest(12, 0)) {	
				if (!me.getQuest(9, 0) && me.diff === 0) { 
					this.hireMerc();	
				//	this.rada();	//-.-
				}	
				this.travel(3);
				this.summoner();			
			}
		}/*else{
			if (!me.getQuest(12, 0)) {	
				if (!me.getQuest(9, 0) && me.diff === 0) { 
					this.rada();	
				}	
			}
		} */
		
		//bonus	
		if ( (((me.charlvl > tombsLvl+1 || this.partyLevel(tombsLvl)) && me.diff ===0) || me.diff !== 0) && !boBarb && !nonSorcChar) {
			if ( !me.getQuest(14, 1) &&  !me.getQuest(14, 3) && !me.getQuest(14, 4)){ //duriel ~done
				if (teamStaff === 0 && teamStaff2 === 0){
					if (!me.getItem(92) && !me.getItem(91) && !me.getQuest(10, 0)){ 
						this.staff();
						if (!me.getItem(92)){ //recursive retry...
							this.staff();
						}
					}
				}
				if (!me.getItem(549) &&  teamStaff2 === 0){
					this.cube();
					if (!me.getItem(549) ){ //recursive retry...
						this.cube();
					}
				}
				if (!me.getItem(521) && !me.getItem(91) && !me.getQuest(10, 0) && teamStaff2 === 0){	
					this.amulet();
					if (!me.getItem(521)){ //recursive retry...
						this.amulet();
					}
				}
				if (teamStaff2 === 0){ //in case someone is wanking with staff and without amu :/
					if (!me.getItem(92) && !me.getItem(91) && !me.getQuest(10, 0)){ 
						this.staff();
						if (!me.getItem(92)){ //recursive retry...
							this.staff();
						}
					}
				}
				if (me.getItem(521) && me.getItem(92) && me.getItem(549)  && teamStaff2 === 0){
					this.cubeStaff();	
				}
			}		
			if (me.getItem(91) || me.getQuest(10, 0) || teamStaff2 === 1){ //staff in inventory or staff stuffed or staff with teammate
				this.travel(4);
				this.duriel();	
			}
		}
		//tombs
		else{
			if(me.getQuest(10, 0) || teamStaff2 === 1 || me.diff !== 0){
				this.duriel();			
			}
			if(me.diff === 0){
				this.tombs();
			}
		}
	}

	//act3
	if (!me.getQuest(23, 0) && me.getQuest(15, 0) ){ //if duriel done, but not meph
		Town.goToTown(3);
		this.figurine();
		if(!boBarb && !nonSorcChar){
			if (me.getQuest(22, 0) ) {
				this.mephisto();
			}
			if (me.getItem(553) && !me.getItem(555) && !me.getQuest(21, 0) && !me.getItem(174) && teamFlail === 0   ){
				this.assemble("eye");
			}
			if (me.getItem(554) && !me.getItem(555) && !me.getQuest(21, 0) && !me.getItem(174) && teamFlail === 0   ) {
				this.assemble("heart");
			}
			if (me.getItem(555)	&& !me.getQuest(21, 0) && !me.getItem(174) && teamFlail === 0   ) {
				this.assemble("brain");
			}
			if (me.getItem(553) && me.getItem(554) && me.getItem(555)  && me.getItem(173)   ){
				this.cubeFlail();
			}
			if ( me.getQuest(17, 1)  ||  (!me.getQuest(17, 0) && teleportingSorc) ){
				this.lamEssen();
			}
			if (!me.getItem(553) && !me.getQuest(21, 0) && !me.getItem(174) && questingSorcA && teamFlail !== 1  ){
				this.eye();
			}
			if (!me.getItem(554) && !me.getQuest(21, 0) && !me.getItem(174) && questingSorcB && teamFlail !== 1  ) {
				this.heart();
			}
			if (!me.getItem(555)	&& !me.getQuest(21, 0) && !me.getItem(174) && (teleportingSorc || teamBrain !== 1) && teamFlail !== 1  ) {
				this.brain();
			}
			if  ((teamFlail === 1 || me.getItem(174) || (me.getItem(553) && me.getItem(554) && me.getItem(555)))){
				this.travincal();
			}else if ( (!me.getQuest(21, 0) || !me.getQuest(18, 0))  ){
				this.travincal();
			}
			if (!me.getItem(554) && !me.getQuest(18, 0) && !me.getItem(174)  && teamFlail !== 1  ){
				this.heart();
			}
			if (me.getItem(554) && !me.getItem(555) && !me.getQuest(21, 0) &&  !me.getQuest(18, 0) && !me.getItem(174) && teamFlail !== 1) {
				this.assemble("heart");
			}
			if (!me.getItem(553) && !me.getQuest(18, 0) && !me.getItem(174)  && teamFlail !== 1  ) {
				this.eye();
			}
			if (me.getItem(553) && !me.getItem(555) && !me.getQuest(21, 0) &&  !me.getQuest(18, 0) && !me.getItem(174) && teamFlail !== 1){
				this.assemble("eye");
			}
			if (!me.getItem(555)	&& !me.getQuest(18, 0) && !me.getItem(174) && teamFlail !== 1  ) {
				this.brain();
			}
			if (me.getItem(555)	&& !me.getQuest(21, 0) && !me.getItem(174) && !me.getQuest(18, 0) && teamFlail !== 1) {
				this.assemble("brain");
			}
			if  ((teamFlail === 1 || me.getItem(174) || (me.getItem(553) && me.getItem(554) && me.getItem(555)))){
				this.travincal();
			}else if ( (!me.getQuest(21, 0) || !me.getQuest(18, 0))  ){
				this.travincal();
			}
			if ( (!me.getQuest(22, 0) && me.getQuest(21, 0) && me.getQuest(18, 0)) || (!me.getQuest(23, 0) && me.getQuest(21, 0) && me.getQuest(18, 0))   ) {
				this.travel(6);
				this.mephisto();
			}
		}else{
			if ( (!me.getQuest(18, 0))  ){
				this.travincal();
			}
			this.mephisto();
		}
	}
	
	//act4
	if (!me.getQuest(28, 0) && me.getQuest(23, 0) ){//if meph done, but not diablo
		Town.goToTown(4);
		if(teleportingSorc){
			this.travel(7);	
		}		
		if ( (!me.getQuest(25, 0) && !teleportingSorc) || me.getQuest(25, 1)) {
			this.izual();
		}
		if (!me.getQuest(26, 0)) {
			this.diablo();
		}	
	}

	//act5
	if (me.getQuest(28, 0) ){//if diablo done
		Town.goToTown(5);
		if (!me.getQuest(35, 1) && !me.getQuest(35, 0)  && questingSorcB) {
			this.shenk();
		}
		if ((!me.getQuest(36,0) && questingSorcA) || me.getQuest(36,1)){
			this.rescueBarbs();
		}
		if ((!me.getQuest(37, 0) && teleportingSorc )|| me.getQuest(37,1)) {
			if(!me.getQuest(37,1)){
				this.travel(8);
			}
			this.anya();
		}			
		if (!me.getQuest(39, 0)) {
			this.ancients();
		}else{
			if(me.charlvl === 42 || me.charlvl	=== 43) {
				this.hireMerc(1);
			}
			if(teleportingSorc){
				this.travel(9);
			}
			this.baal();
		}
	}

}