'use strict';

app.controller('ctrl', function ctrl ($scope, $sce, svc){

	// instantiate the data object, Angular has a real problem with undeclared variables.
	$scope.data = {};
	$scope.loading = false;

	/**
	 * instantiates scope variables
	 * @return {boolean} success or failure of method
	 */
	function init(){
		$scope.backup = false;
		$scope.moving = false;
		$scope.confirm = false;
		$scope.origin = false;
		$scope.turn = {
			'moves': [],
			'pieces': []
		};
		return true;
	};

	init();

	/**
	 * process data returned from the service, extracted to function for reuse
	 * @param  {obj} data raw json data
	 * @return {void}
	 */
	function scopeData(data){
		// console.log(data);
		angular.copy(data, $scope.data);

		// this should be populated by the 'current' node of the object eventually
		if(typeof $scope.data.current == 'undefined'){
			$scope.data.current = {};
			angular.copy($scope.data.base, $scope.data.current);
		}
	};

	/**
	 * encapsulates the call to the service with promise and response
	 * @return {void}
	 */
	$scope.loadData = function(){
		svc.read().success(function(data){
			scopeData(data);
		});
	};

	$scope.loadData();

	/**
	 * utilizes angular dependency to output raw html
	 * @param  {string} unicode the unicode string to be worked with
	 * @return {string}         the actual character(s) to be painted
	 */
	$scope.char = function(unicode){
		return $sce.trustAsHtml(unicode);
	};

	/**
	 * fires on click of a board tile. routes the action accordingly
	 * @param  {string} file the character identifier for the clicked file (column)
	 * @param  {string} rank the character identifier for the clicked rank (row)
	 * @return {eval}      	 optionally executes a function in certain conditions
	 */
	$scope.track = function(file, rank){
		if($scope.data.current[file][rank] || $scope.moving){
			// back up the current state of the board once.
			if(!$scope.backup){
				$scope.backup = {};
				angular.copy($scope.data.current, $scope.backup);
			}

			var ords = file + $scope.data.delimiter + rank;
			var value = $scope.data.current[file][rank]

			if (!$scope.origin) {
				$scope.moving = true;
				$scope.origin = {
					'ords': ords,
					'value': value
				};
			} else if (ords == $scope.origin.ords){
				return $scope.cancel();
			} else {
				var fromOrdParts = $scope.origin.ords.split($scope.data.delimiter);

				if(value != false){
					$scope.turn.pieces.push(value);
				}

				$scope.turn.moves.push($scope.origin.ords + '/' + ords);

				$scope.data.current[file][rank] = $scope.origin.value;

				$scope.data.current[fromOrdParts[0]][fromOrdParts[1]] = false;


				$scope.origin = false;

				$scope.confirm = true;
			}
		}
	};

	/**
	 * parse and process the data, send for storage
	 * @return {eval} reinstantiate scope variables for the next turn
	 */
	$scope.submit = function(){
		//validate data, send to service, restore board appearance

		// append taken pieces onto into the corral
		$scope.data.current.pieces = $scope.data.current.pieces.concat($scope.turn.pieces);

		// append move(s) onto the history object
		$scope.data.current.moves = $scope.data.current.moves.concat($scope.turn.moves);

		// change player turn
		$scope.data.current.player = ($scope.data.current.player === 'white') ? 'black' : 'white' ;

		// send the data off to the service for storage
		svc.store($scope.data);

		return init();
	};

	/**
	 * abort current action, restore data object from "backup"
	 * @return {eval} reinstantiates scope variables for the next turn
	 */
	$scope.cancel = function(){
		angular.copy($scope.backup, $scope.data.current);
		return init();
	};

	/**
	 * resets the game to its original condition
	 * @return {eval} reinstantiates scope variables for the next turn
	 */
	$scope.reset = function(){
		var response = confirm("Are you sure?");
		if(response){
			svc.reset().success(function(data){
				scopeData(data);
			});
			// send the revised
			return init();
		}
	};

	$scope.refresh = function(){
		$scope.loadData();
	};

	$scope.players = {
		editing: false,
		data: {},
		edit: function(){
			angular.copy($scope.data, this.data);
			this.editing = true;

		},
		cancel: function(){
			this.editing = false;
			this.data = {};
		},
		save: function(){
			// send the data off to the service for storage
			svc.store(this.data);
			angular.copy(this.data, $scope.data);
			this.editing = false;
		}
	}
});
