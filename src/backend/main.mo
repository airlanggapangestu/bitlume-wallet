import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";

actor Bitlume {
  // ===== TYPE DEFINITIONS =====
  type Result<T, E> = { #Ok : T; #Err : E };

  type User = {
    bitcoin_address : Text;
  };

  stable var user_storage : [(Principal, User)] = [];
  var user_store = Map.HashMap<Principal, User>(0, Principal.equal, Principal.hash);


  system func preupgrade() {
    user_storage := Iter.toArray(user_store.entries());
  };

  system func postupgrade() {
    user_store := Map.fromIter(user_storage.vals(), 1, Principal.equal, Principal.hash); 
    for ((key, value) in user_storage.vals()) {
      user_store.put(key, value);
    };
  };

  public query func admin_get_all_user() : async [User] {
    let users = Iter.toArray(user_store.vals());
    return users;
  };

  public query({ caller }) func get_profile() : async Result<User, Text> {
    switch (user_store.get(caller)) {
      case (null) {
        return #Err("User not found");
      };
      case (?user) {
        return #Ok({
          bitcoin_address = user.bitcoin_address;
        });
      };
    };
  };

  public shared({ caller }) func create_user(bitcoin_address: Text) : async Result<User, Text> {
    // Check if user already exists
    switch (user_store.get(caller)) {
      case (?_) {
        return #Err("User already exists");
      };
      case (null) {
        // Create new user
        let new_user : User = {
          bitcoin_address = bitcoin_address;
        };
        
        // Store the new user
        user_store.put(caller, new_user);
        
        return #Ok(new_user);
      };
    };
  };
};
