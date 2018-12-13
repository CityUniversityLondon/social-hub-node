var string = 'Amazing news! Congratulations to everyone in the Cass community, we have been ranked 2nd in #london , 5th in #uk and 16th in #europe in the @financialtimes European Business Schools ranking.\n#thisisextraordinarycalling #cass #cassbusinessschool #rankings #ft #financialtimes #europeanbusinessschool #business #school #2nd #5th #16th #amazingnews #amazing #news';

var newst = string.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://instagram.com/$2\">@$2</a>');

function replacer(match, p1, p2, p3, offset, string){
    console.log('match : ' + match);
    console.log('p1 :' + p1);
    console.log('p2 :' + p2);
    console.log('p3 :' + p3);
    console.log('offset :' + offset);
    console.log('string :' + string);

    return '<a href=\"http://instagram.com/' + p2 + '\">@' + p2 + '</a>'; 
}

console.log(newst);