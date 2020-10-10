//This line allows us to access the SCRIPS data
//This data has all of the scripts and their caracteristics
//The ranges are quite important because we can determine what script name each UTF-16 code unit corresponds
require("/Users/macminizouhir/Documents/JS/fileChapter5/scripts.js");


function map(array, transform){
	let mapped = [];
	for (let element of array){
		mapped.push(transform(element));
	}
	return mapped;
}


function reduce(array, combine, start){
	let current = start;
	for(let element of array){
		current = combine(current, element)
	}
	return current;
}



function countBy(items, groupName){
	let counts = [];
	for (let item of items){
		let name = groupName(item);
		
		let known = counts.findIndex(c => c.name == name);
		
		if (known == -1){
			counts.push({name, count: 1});
		} else {
			counts[known].count++;
		}
	}
	return counts;
}

//Personal tests
console.log(countBy([1,2,3,4,5], n => {return n>2?  "superior 2" : n;}));
console.log(countBy([1,2,3,4,5], n => {return n>2?  "superior 2" : n;}) .filter( ({count})=> count !=3 ));


function characterScript(code){
	for (let script of SCRIPTS){
		if (script.ranges.some(  ([from,to]) => {
			return code >= from && code < to;
		})  ) {
			return script;
		}
	}
	return null;
}

//This function uses other functions to determine the % of script types within the text executed upon
function textScripts(text){
//countBy returns a array of objects
//countBy iterates through each character
//Basically each object within the array has a script type and the number of times it was present within the text
	let scripts = countBy(text, char => {
		let script = characterScript(char.codePointAt(0));  //script retrieves the caracter type 
		//characterScript is a function that outputs the script type thanks to function codePointAt
		return script ? script.name: "none";
	}).filter(    ( {name} ) => name != "none"    );
	//we then filter out all of the array elements -objects with the property name "none"
	
	console.log(scripts);
	
	//With the reduce function we calculate the the total number of characters in the text by adding all of the count properties of each object array element
	let total = scripts.reduce((n, {name, count}) => n+count, 0); //function will identify count as a property of scripts automatically  
	if(total == 0) return "No scripts found";
	console.log(total);
	
	//We use the map function to transform the name and count properties of each object array element with the arrow function
	//The final output is the percentage of the number of each script type within the text.
	return scripts.map(({name, count}) => {
		return `${Math.round(count*100/total)}% ${name}`;
	}).join(", ")
}

//The string "11abcdشزذيزذي" is used as an example to see what sripts we obtain in percentages
console.log(textScripts('11abcdشزذيزذي'));