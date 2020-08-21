// Parse local CSV file
Papa.parse("data/data1.csv", {
	complete: function(results) {
		console.log("Finished:", results.data);
	}
});

