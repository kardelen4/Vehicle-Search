import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

let vehicle;
const message = document.getElementById('message');

document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();
    let rego = document.getElementById('rego').value;
    let make = document.getElementById('make').value;
    let model = document.getElementById('model').value;
    let colour = document.getElementById('colour').value;
    let owner = document.getElementById('owner').value;

    message.textContent = '';
    vehicle = null;

    if (!(rego && make && model && colour && owner))
    {
        message.textContent = "Error";
        return;
    }

    let hasowner = await ownerSearch(owner);
    
    if(!hasowner)
    {
        vehicle = {rego, make, model, colour, owner };
        await extraform();
    }
    else
    {
        await addvehicle(rego,make,model,colour,owner);
    }

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

document.getElementById('extraform').addEventListener('submit', async function(event) {
    event.preventDefault();
    let personid = document.getElementById("personid").value;
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let dob = document.getElementById("dob").value;
    let license = document.getElementById("license").value;
    let expire = document.getElementById("expire").value;

    let newadded = await addnewowner(personid, name, address, dob, license, expire);
    if(newadded)
    {
        if(vehicle)
        {
            await addvehicle(vehicle.rego, vehicle.make, vehicle.model, vehicle.colour, name);
            vehicle = null;
            message.textContent = "Vehicle added successfully";
        }
    }

});

async function ownerSearch(owner) {
    const urlsupabase = "https://kwqfjhbzcxxbvqpsmnoo.supabase.co";
    const keysupabase = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cWZqaGJ6Y3h4YnZxcHNtbm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTYyMDIsImV4cCI6MjAzMTE5MjIwMn0.aiKkUN3t0OFbsMPBrXguoYjRE8vLjnx31qP-14Lz65o";
    const supabase = createClient(urlsupabase,keysupabase);

    let item = supabase.from('People').select('Name')
    item = item.ilike('Name', `%${owner}%`);

    const {data, error} = await item;
    if (error) {
        return;
    }
    
    if(data.length === 0){
        message.textContent = "Owner doesnt exist. Please register."; 
        return false;
    }else{
        return true;
    }   
}

async function extraform(){
    let extraform = document.getElementById('extraform');
    extraform.style.display = "";
}

async function addvehicle(rego, make, model, colour, owner) 
{
    const urlsupabase = "https://kwqfjhbzcxxbvqpsmnoo.supabase.co";
    const keysupabase = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cWZqaGJ6Y3h4YnZxcHNtbm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTYyMDIsImV4cCI6MjAzMTE5MjIwMn0.aiKkUN3t0OFbsMPBrXguoYjRE8vLjnx31qP-14Lz65o";
    const supabase = createClient(urlsupabase,keysupabase);

    const {data,error} = await supabase.from('People').select('PersonID').ilike('Name', `%${owner}%`);

    if(data.length === 0){
        return;
    }
    let id = data[0].PersonID;
    let result = await supabase.from('Vehicle').insert({VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: id});
    
    if (result.error) 
    {
        console.log("Error");
        return;
    }
    message.textContent = "Vehicle added successfully";
        
}

async function addnewowner(personid, name, address, dob, license, expire) 
{
    const urlsupabase = "https://kwqfjhbzcxxbvqpsmnoo.supabase.co";
    const keysupabase = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cWZqaGJ6Y3h4YnZxcHNtbm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTYyMDIsImV4cCI6MjAzMTE5MjIwMn0.aiKkUN3t0OFbsMPBrXguoYjRE8vLjnx31qP-14Lz65o";
    const supabase = createClient(urlsupabase,keysupabase);

    const {data,error} = await supabase.from('People').insert({PersonID: personid, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire});
    if (error) 
    {
        return;
    }
    return true;
}