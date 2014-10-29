
function turn_to_miau(txt) {
    var str = "";

    for (i = 0; i < txt.length; i++) 
    {
     //   if(txt.charAt(i)!="." && txt.charAt(i)!="!" && txt.charAt(i)!="?" && txt.charAt(i)!="," && txt.charAt(i)!="-")  
        	if(i==0)
        	{
        		str=str.concat("m");
        	}
        	else if (i==1)
        	{
    	      	str=str.concat("i");
    	    }
        	   else if (i==txt.length-1)
    	    {
    	       	str=str.concat("u");
    	    }
    	   else 
        	{
        		str=str.concat("a");
        	}
    }
    return(str);
}

function turn_to_mau(txt) {
    var str = "";

    for (i = 0; i < txt.length; i++) 
    {
            if(i==0)
            {
             str=str.concat("m");
            }
            else if (i==txt.length-1)
            {
                str=str.concat("u");
            }
            else 
            {
             str=str.concat("a");
            }
    }
    return(str);
}

function turn_to_meow(txt) {
    var str = "";

    for (i = 0; i < txt.length; i++) 
    {
        	if(i==0)
    	    {
    		  str=str.concat("m");
         	}
    	    else if (i==1)
    	    {
        		str=str.concat("e");
        	}
         	else if (i==txt.length-1)
        	{
        		str=str.concat("w");
        	}
        	else 
        	{
        		str=str.concat("o");
        	}
    }
    return(str);
}


function find_indxs (charchar,txt)
{
    
var indices = [];

for(var i=0; i<txt.length;i++) 
    {
        
        if (txt.charAt(i) === charchar) 
        {
            indices.push(i);
        }   
    }

return(indices);
}

function insert_char (charchar,txt,place)
{
    if(place==0)
    {
        return(charchar.concat(txt));
    }
    else
    {
        var str1=txt.substr(0,place);
        var str2=txt.substr(place,txt.length-1);
        str1=str1.concat(charchar);
        return(str1.concat(str2));
    }
}

function insert_char_to_all_indexes (txt,indices)
{
    for(key in indices[0])
    {
        txt=insert_char(indices[1][key],txt,indices[0][key]);
    }
    return(txt);
}

function change_indices (indices)
{
    for(key in indices)
    {

    }
}

function prepare_indices (chars,txt)
{
    
    var indices_ar=[];
    var chars_ar=[];
  
  for(var i=0; i<txt.length;i++)
    {
        
        if (chars.indexOf(txt.charAt(i))>=0) 
        {
            indices_ar.push(i);
            chars_ar.push(txt.charAt(i));
        }   
        
    }
    
    var prepared=[indices_ar,chars_ar];
    
    return(prepared);
}

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 


function random_mau(txt) 
{
    var  num=Math.random()*100;
    if (num<30)
    {
        return(turn_to_miau(txt));
    }
    else if (num<80)
    {
        return(turn_to_meow(txt));
    }
    else
        {return(txt)}
}    

function break_and_miau(txt) 
{
    chars = [",",".","?","!"];
    var str = "";
    var ar=txt.split(" ");
    var word = "";
 
    var indxs=prepare_indices(chars,txt);

    for(key in ar)
    {   
        for(key2 in chars)
        {
            ar[key] = ar[key].replaceAll(chars[key2],"");
        } 
        word=random_mau(ar[key]);   
        str=str.concat(word);
        str=str.concat(" ");
    }
  
    str = insert_char_to_all_indexes(str,indxs);
        
    return(str);
}




