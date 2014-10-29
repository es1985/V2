var game_manager = 
{

  score:0,
  health:100,
  level:0,
  player:"Pips",
  cat:0,
  food_opened:0,
  chat_opened:0,
  other_player_name:"Norman",
  current_emoticons:{},

  read_j: function(txt)
  {
  
/*
JSON object to come out:
{
"sender":TRUE,     ---- who initiated the action
"text":FALSE,    --- text for the chat
"emoticon":FALSE,     --- which emoticon was sent
"food_offered":FALSE,      ---- an offering of food
"food_accepted":FALSE,    --- cat accepting food
"action":FALSE,     --- some other action...?
"score":FALSE,    --- a change to score
"level_up":FALSE    --- a change in level
}
*/

  var jason = JSON.parse(txt);

    if(!jason.sender)
    {
      document.write("ERROR - NO SENDER");
    }

    if (jason.text)
    {
      this.print_text(jason.text,jason.sender);
    }

    if (jason.emoticon)
    {
      this.put_emoticon(jason.emoticon, jason.sender);
    }

    if (jason.food_offered)
    {
     this.offer_food(jason.food_offered, jason.sender);
    }

    if (jason.food_accepted)
    {
     this.accept_food(jason.food_accepted, jason.sender);
    }

    if (jason.score)
    {
      this.change_score(jason.score);
    }
    
    
  },

  onload_game: function(status={})
  {

    if(this.cat)
    {
      this.configure_for_cat();
    }
    else
    {
      this.configure_for_human(); 
    }
  },

  configure_for_human: function()
  {
    //var hi_there = "Hi, "+this.player;
    $(".food_sender_name").html("Hi "+this.player+", ");
    $("#text_with_food").html("would you like to send your cat some food?");
    $("#offered_food_image").attr("src",get_food_file("food1"));
    $(".health-icon").on("click",open_food_thing);
    $(".chat-cat-emoticon").hide();
  },

 configure_for_cat: function()
  {
    
  },

  close_open_chat: function()
  {
    $(".chat-trigger").trigger('click');
    this.change_chat_status();
  },

  change_chat_status: function()
  {
    if (this.chat_opened)
    {
      this.chat_opened=0;
    }
    else
    {
      this.chat_opened=1;
    }
  },


  print_text: function (txt,sender)
  {
    /*

      ========> Sample Chat HTML: <========  
      <li class="chat-message">
              <span class="chat-name">uri hamstr</span>
              <span class="chat-time">23:33</span>
              <span class="chat-single-message">Im so fucking dipressed...I hate my job, and my life...</span>
            </li>
    */
    var chat_message='<li class="chat-message"><span class="chat-name">'+sender+'</span><span class="chat-single-message">'+txt+'</span></li>';
    $(".chat-thread").append(chat_message);
  },

  put_emoticon: function(emoti,sender)
  {
    //document.getElementById("demo").innerHTML = "EMOTICON: "+emoti;
    var chat_message='<li class="chat-message"><span class="chat-name">'+sender+'</li>';
    $(".chat-thread").append(chat_message);
    var emoticon_to_put='<li class="chat-cat-emoticon"><img src="'+get_emoticon_file(emoti)+'" alt="slide 1" /></li>'
    $(".chat-thread").append(emoticon_to_put);
  },

  offer_food: function(food,sender)
  {
    /*
          =====> Sample Food HTML: <======

         <div id="foodModal" class="reveal-modal" data-reveal>
          <p class="lead"> <span class="food_sender_name">Uri</span> thinks you might be Hungry. are you?</p>
          <p class="food-type-cat"><img id="offered_food_image" src="img/food.png"></p>
          <div class="small-12 columns food-buttons-cat">
            <button class="red-x small-6 columns"><i class="fa fa-times"></i></button>
            <button class="green-y small-6 columns"><i class="fa fa-check"></i></button>
          </div>
        <a class="close-reveal-modal">&#215;</a>
        </div>
    */
    $(".food_sender_name").html(sender);
    $("#text_with_food").html("thinks you might be Hungry. are you?");
    $("#offered_food_image").attr("src",get_food_file(food));
    if (this.cat)
    {
      this.open_food_thing=1;
      if (this.chat_opened)
      {
        this.close_open_chat(); 
      }

      if(this.food_opened)
      {
        close_food_thing();
      }

      $('#foodModal').foundation('reveal', 'open');
    }
  },

  accept_food: function(accept,sender)
  {
    
    //document.getElementById("demo").innerHTML = "FOOD ACCEPTED: "+accept;
    if (this.cat)
    {
      $(".food_acceptor_name").html("You");
      if(accept)
      {
       $("#yay").html("Yay!! ");
       $("#food_acceptor_text").html(" just had lunch!");
       $("#foodModal-approve-points").html(" +100 Points! ");
      }
      else
      {
        $("#yay").html("Ok ok. ");
       $("#food_acceptor_text").html(" are not hungry at the moment");
      }
    }
    else
    {
      $(".food_acceptor_name").html(sender);
      if(accept)
      {
       $("#yay").html("Yay!! ");
       $("#food_acceptor_text").html(" just had lunch!");
       $("#foodModal-approve-points").html(" +100 Points! ");
      }
      else
      {
       $("#food_acceptor_text").html(" is not hungry at the moment");
      }
    }
      this.open_food_thing=1;
      if (this.chat_opened)
      {
        this.close_open_chat(); 
      }

      if(this.food_opened)
      {
        close_food_thing();
      }

      $('#foodModal-approve').foundation('reveal', 'open');
    

  },

  change_score: function(change)
  {
    this.score=this.score+change;
    if (this.score>=100)
    {
      this.leveled_up(1);
    }
    $("#score_number").html(this.score);
  },

  leveled_up: function(up)
  {
    //document.getElementById("demo").innerHTML = "LEVELED UP: "+up;
  },

  food_accepted: function(accepted,sender)
  {

  },

  get_player_name: function()
  {
    return(this.player);
  },

  get_score: function()
  {
    return(this.score);
  },

  is_cat: function()
  {
    return(this.cat);
  },

  send_j:function(txt)
  {
    // TO SOCKET.IO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  }

};

function open_food_thing()
{
  $('#foodModal').foundation('reveal', 'open');
  game_manager.open_food_thing=1;
};

function close_food_thing()
{
  $('#foodModal').foundation('reveal', 'close');
  game_manager.open_food_thing=0;
};

function get_emoticon_file(txt)
{
  var diction = {"happy":"img/emo-01.png", "sad":"img/emo-01.png"};

  if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 
};

function get_food_file(txt)
{
  var diction = {"food1":"img/food.png", "food2":"img/food.png"};

   if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 
};

function text_submitted()
{
  var submitted_txt = $('#chat_text').val();
  $('#chat_text').val("");
  var sender_dude=game_manager.get_player_name();

  if (game_manager.is_cat())
  {
    submitted_txt=break_and_miau(submitted_txt);
  }

  var jesson ={
    text:submitted_txt,
    sender:sender_dude,
    score:2,
  };
  var  txt = JSON.stringify(jesson);
  game_manager.read_j(txt);
  game_manager.send_j(txt);
};

function emoticon_clicked(emoti)
{
  var sender_dude=game_manager.get_player_name();
  var jesson ={
    sender:sender_dude,
    emoticon:emoti,
    score:3,
  };
  var  txt = JSON.stringify(jesson);
  game_manager.read_j(txt);
  game_manager.send_j(txt);

};

function food_clicked(positive)
{
  
  var sender_dude=game_manager.get_player_name();
  $('#foodModal').foundation('reveal', 'close');
  game_manager.open_food_thing=0;

  if (game_manager.is_cat())
  {
    if (positive)
      {var score_change=100;}
    else
      {var score_change=0;}

    var jesson =
    {
      sender:sender_dude,
      food_accepted:positive,
      score:score_change,
    };
  }
  else
  {
    if (positive)
    {
      var jesson =
      {
        sender:sender_dude,
        food_accepted:positive,
        score:score_change,
      };
    }
   else
    {
      var jesson=FALSE;
    }
  }

  if (jesson)
  { 
    var  txt = JSON.stringify(jesson);
    game_manager.read_j(txt);
    game_manager.send_j(txt);
  }

};