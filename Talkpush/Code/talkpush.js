const API_FIELD_IS_REQUIRED = "API Key is required!";
const CAMPAIGN_ID_FIELD_IS_REQUIRED = "Campaign ID is required!";
const SHORTLIST_STATUS= "shortlist";

// Function to Create Campaign
function createCampaign(){
	
	if(document.getElementById('api_key').value==""){
		alert(API_FIELD_IS_REQUIRED);
		return;
	} else if(document.getElementById('campaign_title').value==""){
		alert("Campaign Name is required!");
		return;
	} else if(document.getElementById('job_title').value==""){
		alert("Job Title is required!");
		return;
	} else if(document.getElementById('country').value==""){
		alert("Country is required!");
		return;
	}
	
	// Create a new campaign in your Talkpush account
  fetch("https://my.talkpush.com/api/talkpush_services/campaigns", {

    method: "POST",

    body: JSON.stringify({
      api_key: document.getElementById('api_key').value,
      campaign: {
        campaign_title: document.getElementById('campaign_title').value,
        job_title: document.getElementById('job_title').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        region: document.getElementById('region').value,
        postal_code: document.getElementById('postal_code').value,
        country: document.getElementById('country').value,
        short_description: document.getElementById('short_description').value,
        long_description: document.getElementById('long_description').value,
        ats_external_id: document.getElementById('ats_external_id').value,
        job_type: document.getElementById('job_type').value,
        salary: document.getElementById('salary').value,
        salary_type: document.getElementById('salary_type').value,
        salary_currency: document.getElementById('salary_currency').value 
      }  
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })

// Converting to JSON
  .then(response => response.json())
  .then(json => {
	let campaignSample = "";
	if(json.campaign != undefined){
		document.getElementById('api_key2').value=document.getElementById('api_key').value;
		campaignSample = json.campaign;
		document.getElementById('campaign_Id2').value = campaignSample.id;
	}
	if(json.message != undefined){
		if(campaignSample.id!=undefined && campaignSample.id!=""){
			alert(json.message+"\n\n"+"Campaign ID: "+campaignSample.id);
		} else {
			alert(json.message);
		}	
			
	} else if (json.response != undefined){
	  if(json.countries != undefined){
		  var missingCuntries = "";
		  for (var i = 0; i < json.countries.length; i++) {
				if(missingCuntries==""){
					missingCuntries = json.countries[i].name;
				}else{
					missingCuntries = missingCuntries +', ' + json.countries[i].name;
				}					
			}
			alert(json.response+" "+ missingCuntries);
	  } else {
		  alert(json.response) 
	  }		
	}       
  })
}
 
// Function to Create Candidate
function createCandidate(){
	let apiKey = document.getElementById('api_key2').value;
	let campId = document.getElementById('campaign_Id2').value;	
	if(apiKey==""){
		alert(API_FIELD_IS_REQUIRED);
		return;
	}
	if(campId==""){
		alert(CAMPAIGN_ID_FIELD_IS_REQUIRED);
		return;
	}
	
// Create a new lead
fetch("https://my.talkpush.com/api/talkpush_services/campaigns/"+campId+"/campaign_invitations?api_key="+apiKey, {

    method: "POST",

    body: JSON.stringify({
      api_key: document.getElementById('api_key').value,
      campaign_invitation: {
        first_name: document.getElementById('first_name2').value,
        last_name: document.getElementById('last_name2').value,
        email: document.getElementById('email2').value,
        user_phone_number: document.getElementById('user_phone_number2').value,
        source: document.getElementById('source2').value,
        //others: document.getElementById('others2').value
      }  
    }),
// Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
// Converting to JSON
  .then(response => response.json())
// Displaying results to console
  .then(json => {
	if(json.error != undefined){
		alert(json.error);
		return;
	}
	if(json.message != undefined){		
		
		if(json.id!=undefined){
			alert(json.message+"\n\n"+"Lead ID: "+json.id);
			document.getElementById('api_key3').value = document.getElementById('api_key2').value;
			document.getElementById('campaign_Id3').value = document.getElementById('campaign_Id2').value;			
			retrieveCandidates();
		}else{
			alert(json.message);
		}				
	} else if (json.response != undefined){
		  alert(json.response);
		  return;
	}
	
  })
}

// Function to Retrieve Candidates
function retrieveCandidates() {
	let apiKey = document.getElementById('api_key3').value;
	let campId = document.getElementById('campaign_Id3').value;	
	if(apiKey==""){
		alert(API_FIELD_IS_REQUIRED);
		return;
	}
	
  fetch(
	// This API endpoint will enable you to search through your lead database programatically with the same criterias than you would use on the recruiter's leads page.
    "https://my.talkpush.com/api/talkpush_services/campaign_invitations?api_key="+apiKey+"&filter[campaign_id]="+campId
  )
  .then((response) => response.json())
  .then((json) => { 
	  
	 if(json.error != undefined){
		alert(json.error);
		return;
	}
	if(json.message != undefined){
		alert(json.message);		
		return;
	} else if (json.response != undefined){
		  alert(json.response);
		  return;
	}
	
    let talkPushData = (
      `<tr>
      <th>Campaign Name</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Phone Number</th>
      <th>School Name</th>
      <th>Education</th>
      <th>Gender</th>
      <th>State</th>
	  <th>ID</th>
      <th>Candidate ID</th>
      <th>ShortList</th>
      </tr>`
    );
    json.candidates.forEach((user) => {
      talkPushData += (
      `<tr>
      <td>${user.campaign_title}</td>
      <td>${user.first_name}</td>
      <td>${user.last_name}</td>
      <td>${user.email}</td>
      <td>${user.user_phone_number}</td>
      <td>${user.school_name}</td>
      <td>${user.education}</td>
      <td>${user.gender}</td>
      <td>${user.state}</td>
	  <td>${user.id}</td>
      <td>${user.candidate_id}</td>
      <td><button onclick="shortListCandidate(${user.id})">Short List</button></td>
      </tr>`
      );
    });
    document.getElementById("candidates").innerHTML = talkPushData;
  });
}

// Shortlist a candidate
function shortListCandidate(id){
	// Change lead's status
	fetch("https://my.talkpush.com/api/talkpush_services/campaign_invitations/"+id+"/"+SHORTLIST_STATUS, {
    method: "PUT",

    body: JSON.stringify({
      api_key: document.getElementById('api_key3').value
    }),
	// Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
// Converting to JSON
  .then(response => response.json())
// Displaying results to console
  .then(json => {
	if(json.error != undefined){
		alert(json.error);
		return;
	}
	if(json.message != undefined){
		alert(json.message);
			return;
	} else if (json.response != undefined){
		  alert(json.response);
		  retrieveCandidates();
		  return;
	}
	
  })
}

// Clear the all inputs in the Create Campaign section
function clearButtonCampaign() {
  const form = document.getElementById('createCampaignForm');
  form.reset();  
}

// Clear the all inputs in the Create Candidate section
function clearButtonCandidate() {
  const form = document.getElementById('createCandidateForm');
  form.reset();  
}

// Clear the all inputs in the Retrieve Candidate section
function clearButtonRetrieve() {
  const form = document.getElementById('retrieveCantidateForm');
  form.reset();  
}

