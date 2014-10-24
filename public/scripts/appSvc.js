'use strict';

app.factory('svc', function($http){

	function noCache(seed){
		if(arguments.length === 0) {
			seed = Math.ceil((Math.random() * 1000) * (Math.random() * 1000));
		}
		var now = new Date().now;

		return '?nocache=' + now + '' + seed;
	}

	return {
		reset: function(){
			return $http({
				method: 'GET',
				url: '/data/reset/' + noCache()
			});
		},
		read: function () {
			return $http({
				method: 'GET',
				url: '/data/read/' + noCache()
			});
		},
		store: function(data){
			/**
			 * The workhorse; converts an object to x-www-form-urlencoded serialization.
			 * @param {Object} obj
			 * @return {String}
			 */
			// var param = function(obj)
			// {
			//   var query = '';
			//   var name, value, fullSubName, subName, subValue, innerObj, i;

			//   for(name in obj)
			//   {
			// 	value = obj[name];

			// 	if(value instanceof Array)
			// 	{
			// 	  for(i=0; i<value.length; ++i)
			// 	  {
			// 		subValue = value[i];
			// 		fullSubName = name + '[' + i + ']';
			// 		innerObj = {};
			// 		innerObj[fullSubName] = subValue;
			// 		query += param(innerObj) + '&';
			// 	  }
			// 	}
			// 	else if(value instanceof Object)
			// 	{
			// 	  for(subName in value)
			// 	  {
			// 		subValue = value[subName];
			// 		fullSubName = name + '[' + subName + ']';
			// 		innerObj = {};
			// 		innerObj[fullSubName] = subValue;
			// 		query += param(innerObj) + '&';
			// 	  }
			// 	}
			// 	else if(value !== undefined && value !== null)
			// 	{
			// 	  query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			// 	}
			//   }

			//   return query.length ? query.substr(0, query.length - 1) : query;
			// };

			return $http({
				'method': 'POST',
				'url': '/data/store/' + noCache(),
				'data': data,
				'headers': {
					'Content-Type': 'application/json'
				},
				'responseType': 'string'
			});}
	};
});
