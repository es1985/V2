
var game_manager = 
{

  cat:1,
  score:0,
  health:100,
  health_proxy:100,
  level:0,
  player:"Norman",
  food_opened:0,
  chat_opened:0,
  other_player_name:"Norman",
  current_emoticons:[],
  notifications:0,
  dead:0,
  health_timer:{},
  level_modal_open:0,
  modal_cue:[],
  message_number:0,
  emoticon_number:0,
  local:0,
  socket:{},
  cat_stage:"swiffycontainer",

  read_j: function(txt)
  {
  
  /*
JSON object to come out:
{
"sender": string,     ---- name of who initiated the action
"text":string,    --- text for the chat
"emoticon":pre-defined string,     --- which emoticon was sent ("happy", "sad"...)
"food_offered":number, designating serial number of food type,  ---- an offering of food (1:"food1", 2:"food2"...)
"food_accepted":0 - NOT accepting,  1,2.. types of food    --- cat accepting or rejecting food 
"action":???,     --- some other action...?
"score":number,    --- a change to score
"notification":1 --- a new notification
"nu_health":number
"cat_animation_loop": string - put an animation
"cat_anim1":string - put an animation BEFORE ANOTHER (cat_anim2)
"cat_anim2":string - second animation
"time_between_animations" - time between cat_anim1 and cat_anim2
dead:0,1  - if dead
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
      if (this.cat)
       { 
         this.offer_food(jason.food_offered, jason.sender);
       }
    }

    if (jason.food_accepted>=1 || jason.food_accepted===0)
    {
     this.accept_food(jason.food_accepted, jason.sender);
    }

    if (jason.score)
    {
      this.change_score(jason.score);
    }

       if (jason.notification)
    {
      this.add_notification();
    }
    
    if(jason.nu_health)
    {
      this.health_me(jason.nu_health);
    }

    if(jason.cat_animation_loop)
    {
      this.put_animaiton_loop(jason.cat_animation_loop);
    }

    if(jason.cat_anim1 && jason.cat_anim2 && jason.time_between_animations)
    {
      this.put_animaiton_plus_loop(jason.cat_anim1,jason.cat_anim2,jason.time_between_animations);
    }

    if(jason.dead)
    {
      this.dead=1;
      this.score=0;
      this.level=0;
    }

    if (jason.dead===0)
    {
      this.dead=0;
    }
    
  },

  onload_game: function()
  {
    //animation_manager.play_anim("cat_breathing",'swiffycontainer');
    //animation_manager.play_anim("sick_cat",'swiffycontainer');
    if (!this.local)
    { 
      this.socket = io();
    }
    $(".human-feed").hide(); 
    
    $('#points-drop').hide();

    $("#in-chat-input").submit(function(e) {
    e.preventDefault();
  });
    this.cat=Number(localStorage.getItem("is_cat"));
    this.adjust_health_pic();
    this.update_health(1);
    this.listen_to_json();
    this.update_notifications();
    
    $('#foodModal').bind('close', function() 
      { 
        game_manager.progress_cue();
      });

    $('#foodModal-approve').bind('closed', function() 
      { 
        game_manager.progress_cue();
      });

    $('#levelModal').bind('closed', function() 
      { 
        game_manager.progress_cue();
      });

    $('#landingModal').bind('closed', function() 
      { 
        game_manager.progress_cue();
      });

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
    $("#health-image").hide();
    $("#text_with_food").html("would you like to send your cat some food?");
    $("#offered_food_image").attr("src",get_food_file("1"));
    $(".human-feed").on("click",open_food_thing);
    $("#chat-drop .orbit-container").hide();
    this.other_player_name="Pips";
    $(".human-feed").show(); 
  },

 configure_for_cat: function()
  {

    this.player="Pips";
    
    $("#offered_food_image").attr("src",get_food_file("1"));
    this.add_emoticon("emo-happy");
    this.add_emoticon("emo-worried");
    this.add_emoticon("emo-mad");
    this.add_emoticon("emo-night");
    this.add_modal("#landingModal");
  },

  

  add_emoticon: function(emotic)
  {
     this.current_emoticons.push(emotic);
    // put emoticon in the HTML ----------
  },

put_animaiton_loop: function(anim)
  {
    animation_manager.play_anim_loop(anim,this.cat_stage);
  },


   send_animation_loop: function(anim)
  {
    var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    cat_animation_loop:anim
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt);
  },

  put_animaiton_plus_loop: function(anim1,anim2,time_str)
  {
    time=Number(time_str);
    animation_manager.play_anim_and_loop(anim1,anim2,time,this.cat_stage);
     
  },

   send_animation_plus_loop: function(anim1,anim2,time)
  {
    var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    cat_anim1:anim1,
    cat_anim2:anim2,
    time_between_animations:time,
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt);
  },

  cat_clicked: function()
  {
    if (!this.dead)
    {
      this.send_animation_plus_loop('eyes_twitch','cat_breathing',1000);
    }
  },

  add_notification: function()
  {
    if(!this.chat_opened)
    {
      this.notifications++;
      this.update_notifications();
    }
  },

  update_notifications: function()
  {
    if (this.chat_opened)
    {
      this.notifications=0;
      $('.chat-notifications').hide();
    }
    else
    {

      if (this.notifications)
      {
        $('.chat-notifications').html(this.notifications);
        $('.chat-notifications').show();
      }
      else
      {
        $('.chat-notifications').hide();
      }
    }
  },  

  close_open_chat: function()
  {
    $(".chat-trigger").trigger('click');
    //this.change_chat_status();
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
    this.update_notifications();
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
    var text_class = "other-message";
    if (this.player==sender)
      {
        text_class = "own-message";
      }
    var chat_message='<li class="chat-message '+text_class+'"><span class="chat-name">'+sender+'</span><span class="chat-single-message">'+txt+'</span></li>';
    $(".chat-thread").append(chat_message);
    this.message_number++;
    $(".chat-message")[this.message_number-1].scrollIntoView();
  },

 put_emoticon: function(emoti,sender)
  {
    var text_class = "other-message";
    if (this.player==sender)
      {
        text_class = "own-message";
      }

    var chat_message='<li class="chat-message2 '+text_class+'"><span class="chat-name">'+sender+'</span><img class="sent-emoticon" src="'+get_emoticon_file(emoti)+'" alt="slide 1" /></li>';
    $(".chat-thread").append(chat_message);
     this.emoticon_number++;
    $(".chat-message2")[this.emoticon_number-1].scrollIntoView();
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
      this.food_opened=1;
      
      /*
      if (this.chat_opened)
      {
        this.close_open_chat(); 
      }
      */
      /*
      if(this.food_opened)
      {
        close_food_thing();
      }
      */

      //$('#foodModal').foundation('reveal', 'open');
      this.add_modal("#foodModal");
    }
  },


  add_modal: function(modal_id)
  {
    this.modal_cue.push(modal_id);
    this.operate_cue();
  },

  operate_cue: function()
  {

    if (this.chat_opened)
    {
      this.close_open_chat();
    }

    if(this.modal_cue.length>0)
    {
      var displayed = $(this.modal_cue[0]).css("display");

      if (displayed=="none")
      { 
        $(this.modal_cue[0]).foundation('reveal', 'open');
      }
    }
  },

  progress_cue: function()
  {
    this.modal_cue.reverse();
    this.modal_cue.pop();
    this.modal_cue.reverse();
    this.operate_cue();
  },

  accept_food: function(accept,sender)
  {
    this.update_health(accept);
    if (this.cat)
    {
      $(".food_acceptor_name").html("You");
      if(accept)
      {
       $("#yay").html("Yay!!!!!! ");
       $("#approve-img").attr("src","img/food-approve-img.png");
       $("#food_acceptor_text").html(" just had lunch!");
       $("#foodModal-approve-points").html("+100");
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
      
      /*
      if (this.chat_opened)
      {
        this.close_open_chat(); 
      }
      */

      /*
      if(this.food_opened)
      {
        close_food_thing();
      }
      */
      //$('#foodModal-approve').foundation('reveal', 'open');
      this.add_modal("#foodModal-approve");
    
  },


  health_me: function(new_health)
  {
    this.health=new_health;
    this.adjust_health_pic();
  },


  update_health: function(food)
  {
   
    
    if (food)
    {
      var new_health=106+Math.random()*20;
      var sender_dude=this.get_player_name();  
       //this.put_animaiton_loop("cat_breathing",'swiffycontainer');

      var jesson={
        sender:sender_dude,
        nu_health:new_health,
        dead:0,
        cat_animation_loop:"cat_breathing"
      }

      var  txt = JSON.stringify(jesson);

      if(this.local)
      {  
       game_manager.read_j(txt);
      }

      game_manager.send_j(txt);

      if (this.cat)
        {
          window.clearInterval(this.health_timer);
          this.set_health_timer();
        }
    }
    else
    {
      
    }
    /*
    if (this.health<0)
    {
      this.play_dead();
    }
    */
  },

  hunger_tick: function()
  {
    new_health = this.health-5;
    var sender_dude=this.get_player_name();

      var jesson={
        sender:sender_dude,
        nu_health:new_health,
      }

      var  txt = JSON.stringify(jesson);
      
      if(this.local)
      {  
        game_manager.read_j(txt);
      }

      game_manager.send_j(txt);
  },

  adjust_health_pic: function()
  {
    if (this.cat)
    {
      if (this.health>=75)
      {
       $("#health-image").attr("src",get_health_file("health1"));
       $("#cat_avatar").attr("src",get_cat_file("healthy"));    
      }
      else if (this.health>=50)
      {
        $("#health-image").attr("src",get_health_file("health2"));
        $("#cat_avatar").attr("src",get_cat_file("healthy")); 
      }
      else if (this.health>=25)
      {
         $("#health-image").attr("src",get_health_file("health3"));
         $("#cat_avatar").attr("src",get_cat_file("healthy")); 
      }
       else if (this.health>=0)
     {
        $("#health-image").attr("src",get_health_file("health4"));
        $("#cat_avatar").attr("src",get_cat_file("healthy")); 
      }
      else if (0>this.health)
      {
        $("#health-image").attr("src",get_health_file("health5"));
        //$("#cat_avatar").attr("src","img/cat-sick.png"); 
         if (!this.dead)
         {
         this.play_dead();
        }
     }
    }
  },

  set_health_timer: function()
  {
    this.health_timer=setInterval(function () {game_manager.hunger_tick()}, 25000);
  },

  play_dead: function()
  {
    
      var sender_dude=game_manager.get_player_name();
      var jesson =
      {
        sender:sender_dude,
        cat_animation_loop:"sick_cat",
       dead:1,
      };

    txt=JSON.stringify(jesson);

    if(this.local)
      {  
        game_manager.read_j(txt);
      }

      game_manager.send_j(txt);
    //this.put_animaiton_loop("sick_cat",'swiffycontainer');
    
  },

  decide_level: function()
  {
    levels_array=[0,100,300,600,1000]
    level=0;
    for(i = 0; i < levels_array.length; i++)
      {
        if (this.score>=levels_array[i])
        {
          level = i;
        }
        else
        {
          return(level);
        }
      }
  },


  adjust_level: function()
  {
    if (this.decide_level()>this.level)
    {
      this.leveled_up(this.decide_level()-this.level);
    }
    $("#level").html(this.level);
  },

  change_score: function(change)
  {
    this.score=this.score+change;
    this.adjust_level();
    $("#score_number").html(this.score);
  },

  leveled_up: function(up)
  {
    this.level=this.level+up;
    $('.level-modal-level').html(this.level)
    //this.close_all();
    //$('#levelModal').foundation('reveal', 'open');
    this.add_modal('#levelModal');
    this.level_modal_open=1;
  },

  close_all: function() // DEPRECIATED. FOR NOW NO USE WHATSOEVER!!!
  {
    if (this.level_modal_open)
    {
      $('#levelModal').foundation('reveal', 'close');
      this.level_modal_open=0;
    }

    if (this.food_opened)
    {
     close_food_thing();
     this.food_opened=0;
    }
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

  is_local: function()
  {
    return(this.local);
  },

  send_j:function(txt)
  {
    if (!this.local)
    {
      this.socket.emit('chat message', txt);
    }
  },

  listen_to_json: function()
  {
    if (!this.local)
    {
      this.socket.on('chat message', function(msg){game_manager.read_j(msg);});
    }
  }

};



//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------



function open_food_thing()
{
  //$('#foodModal').foundation('reveal', 'open');
  game_manager.add_modal('#foodModal');
  game_manager.open_food_thing=1;
}

function close_food_thing()
{
  $('#foodModal').foundation('reveal', 'close');
  game_manager.open_food_thing=0;
}

function get_emoticon_file(txt)
{
  var diction = {
 "emo-happy":"img/emoticons/emo-happy.png",
 "emo-love":"img/emoticons/emo-love.png",
 "emo-dayan":"img/emoticons/emo-dayan.png",
 "emo-hipster":"img/emoticons/emo-hipster.png",
 "emo-kania":"img/emoticons/emo-kania.png",
 "emo-mad":"img/emoticons/emo-mad.png",
 "emo-night":"img/emoticons/emo-night.png",
 "emo-pilot":"img/emoticons/emo-pilot.png",
 "emo-worried":"img/emoticons/emo-worried.png",
 "emo-food":"img/emoticons/emo-food.png",
 
};

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
  var diction = {"1":"img/food.png", "food2":"img/food.png"};

   if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 
};

function get_health_file(txt)
{
  var diction = {"health1":"img/health-01.png", "health2":"img/health-02.png", "health3":"img/health-03.png", "health4":"img/health-04.png","health5":"img/health-05.png"};

   if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 
};

function get_cat_file(txt)
{
  var diction = { "healthy":"img/cat.png","sick":"img/cat-sick.png"};
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
    score:1,
    notification:1,
  };
  var  txt = JSON.stringify(jesson);
  if(game_manager.is_local())
  { 
    game_manager.read_j(txt);
  } 
  game_manager.send_j(txt);
}

function emoticon_clicked(emoti)
{
  var sender_dude=game_manager.get_player_name();
  var jesson ={
    sender:sender_dude,
    emoticon:emoti,
    score:2,
    notification:1,
  };
  var  txt = JSON.stringify(jesson);
  if(game_manager.is_local())
  { 
   game_manager.read_j(txt);
  }
  game_manager.send_j(txt);

}

function food_clicked(food)
{
  
  var sender_dude=game_manager.get_player_name();
$('#foodModal').foundation('reveal', 'close');
game_manager.open_food_thing=0;

if (game_manager.is_cat())
{
  if (food)
    {var score_change=100;}
  else
    {var score_change=0;}

  var jesson =
  {
    sender:sender_dude,
    food_accepted:food,
    score:score_change,
  };

}
else
{
  if (food)
  {
    var jesson =
    {
     sender:sender_dude,
      food_offered:food,
      score:score_change,
     };
  }
  else
  {
    var jesson=false;
  }
}

if (jesson)
{
  var  txt = JSON.stringify(jesson);
  if(game_manager.is_local())
  {
    game_manager.read_j(txt);
  }
  game_manager.send_j(txt);
}

}

// ---------->--------------->-----------> Unrelated to the game manager!!!

/*
// ----> Remove address bar from browser
window.addEventListener("load",function() {
    // Set a timeout...
    setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 0);
    }, 0);
  });

*/


/*
function hideAddressBar()
{
  if(!window.location.hash)
  {
      if(document.height < window.outerHeight)
      {
          document.body.style.height = (window.outerHeight + 50) + 'px';
      }
 
      setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
  }
}
 
window.addEventListener("load", function(){ if(!window.pageYOffset){ hideAddressBar(); } } );
window.addEventListener("orientationchange", hideAddressBar );
*/
