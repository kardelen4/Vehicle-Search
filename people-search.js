import { createClient } from
   'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

   document.getElementById('form').addEventListener('submit',function(event)
   {
       event.preventDefault();
       let name = document.getElementById('name').value;
       let license = document.getElementById('license').value;
       let message = document.getElementById('message');
   
       message.textContent = '';
   
       if ((name && license) || (!name && !license))
       {
            clear();
            message.textContent = "Error";
            return;
       }
   
       peopleSearch(name,license,message);
    });

    document.getElementById('darkmode').addEventListener('click',function(event)
    {
        let body = document.body;
        let currentBackgroundColor = window.getComputedStyle(body).backgroundColor;
        
        if (currentBackgroundColor === 'rgb(255, 255, 255)') {
            body.style.backgroundColor = 'gray';
            body.style.color = 'white';

        } else {
            body.style.backgroundColor = 'white';
            body.style.color = 'black';
        }

    });


async function peopleSearch(name,license,message) {
    const urlsupabase = "https://kwqfjhbzcxxbvqpsmnoo.supabase.co";
    const keysupabase = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cWZqaGJ6Y3h4YnZxcHNtbm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTYyMDIsImV4cCI6MjAzMTE5MjIwMn0.aiKkUN3t0OFbsMPBrXguoYjRE8vLjnx31qP-14Lz65o";
    const supabase = createClient(urlsupabase,keysupabase);

    let item = supabase.from('People').select();

    if (name) 
    {
        item = item.ilike('Name',`%${name}%`);
    }
    else if (license)
    {
        item = item.ilike('LicenseNumber', `%${license}%`);
    }

    const{data,error} = await item;

    if (error)
    {
        console.error('Error', error.message);
        clear(data);
        return;
    }
    if (data && data.length > 0)
    {
        message.textContent = "Search successful"; 
        outputvalues(data);
    }
    else 
    {
        message.textContent = "No result found"; 
        clear(data);
    }
       

}

function clear() {
    const display = document.getElementById('results');
    display.innerHTML = "";
}

function outputvalues(values)
{
    let display = document.getElementById('results');
    display.innerHTML = "";
    values.forEach(singleitem => {
        const x = document.createElement('div');
        x.classList.add('result');
        x.innerHTML = `
        <p>PersonID: ${singleitem.PersonID}</p>
        <p>Name: ${singleitem.Name}</p>
        <p>Address: ${singleitem.Address}</p>
        <p>DOB: ${singleitem.DOB}</p>
        <p>LicenseNumber: ${singleitem.LicenseNumber}</p>
        <p>ExpiryDate: ${singleitem.ExpiryDate}</p>
        `;
        display.appendChild(x);
    });
}




