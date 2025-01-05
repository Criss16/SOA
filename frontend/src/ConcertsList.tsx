import {useEffect, useState} from "react";
import {useAuth} from "./AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {Concert} from "./Types.tsx";

const ConcertsList = ()=> {
    const [concerts, setConcerts] = useState<Concert[]>([]);
    useEffect(()=> {
        fetch("http://localhost/concerts/concerts").then(res=> res.json()).then(fetchedConcerts=> setConcerts(fetchedConcerts));
    }, []);
    const auth = useAuth();
    const navigate = useNavigate();

    return (

        <div>
            {
                auth.isAuthenticated ? "User logged in" : "Please log in before buying tickets"
            }
            {
                !auth.isAuthenticated &&
                <button onClick={()=> navigate("/login")}> Log in </button>
            }
            {
                concerts.map((concert, index)=>(
                    <div key={index}>
                        {concert.eventname + " " + concert.artist}
                        {
                            auth.isAuthenticated &&
                            <button onClick={() => navigate(`/concerts/${concert._id}`)}> See details </button>
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default ConcertsList;