import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Concert} from "./Types.tsx";
import {useAuth} from "./AuthContext.tsx";

const ConcertDetailsPage = ()=> {
    const {concertId} = useParams();
    const [concert, setConcert] = useState<Concert>();
    useEffect(()=> {
        fetch(`http://localhost/concerts/concerts/${concertId}`).then(res=> res.json()).then(fetchedConcert=> setConcert(fetchedConcert));
    }, [concertId]);

    const auth = useAuth();

    const onBuyTicket = () => {
        fetch(`http://localhost/tickets/${concertId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: auth.token}),
        }).then(() => {
            alert("Ticket purchased successfully!");
        }).catch((err) => {
            console.log(err);
            alert("Could not buy ticket!");
        })
    }

    if (!concert) {
        return null;
    }
    return (
        <div>
            <div>
                {
                    concert.eventname + " " + concert.artist + " " + concert.location
                }
            </div>
            <div>
                <button onClick={onBuyTicket}> Buy ticket </button>
            </div>
        </div>
    );
}

export default ConcertDetailsPage;