import React from "react";
import { SubmitButton } from "../../components/buttons/Button";
import { FormStepProps } from "../../components/form/FormTabs";

const Step4: React.FC<FormStepProps> = ({ values, onChange, formErrors }) => {
  return (
    <>
      <details className="details">
        <summary>
          Persoonlijke gegevens <span>open</span>
        </summary>
        <div className="detailscontent">
          <div className="forminput">
            <label htmlFor="naam">naam</label>
            <input type="text" id="naam" name="naam" value="Fabry" />
          </div>
          <div className="forminput">
            <label htmlFor="voornaam">voornaam</label>
            <input type="text" id="voornaam" name="voornaam" value="Seppe" />
          </div>
          <div className="formrow">
            <div className="forminput">
              <label htmlFor="straat">straat</label>
              <input type="text" id="straat" name="straat" value="Grote Baan" />
            </div>
            <div className="forminput">
              <label htmlFor="nummer">nr</label>
              <input type="text" name="nummer" id="nummer" value="180" />
            </div>
            <div className="forminput">
              <label htmlFor="bus">bus</label>
              <input type="text" name="bus" id="bus" />
            </div>
          </div>
          <div className="formrow">
            <div className="forminput">
              <label htmlFor="gemeente">gemeente</label>
              <input
                type="text"
                name="gemeente"
                id="gemeente"
                value="Hulshout"
              />
            </div>
            <div className="forminput">
              <label htmlFor="postcode">postcode</label>
              <input type="text" name="postcode" id="postcode" value="2235" />
            </div>
          </div>
          <div className="forminput final">
            <label htmlFor="telefoon">telefoon</label>
            <input
              type="text"
              name="telefoon"
              id="telefoon"
              value="+32456552678"
            />
          </div>
        </div>
      </details>
      <details>
        <summary>
          Gegevens viervoeters <span>open</span>
        </summary>
        <details>
          <summary>Jacko</summary>
          <div className="detailscontent">
            <div className="forminput">
              <label htmlFor="naam">naam</label>
              <input type="text" id="naam" name="naam" value="Jacko" />
            </div>
            <div className="forminput">
              <label htmlFor="geboortedatum">geboortedatum</label>
              <input
                type="date"
                id="geboortedatum"
                name="geboortedatum"
                value="2001-03-20"
              />
            </div>
            <div className="formrow">
              <div className="forminput">
                <label htmlFor="straat">ras</label>
                <input type="select" id="ras" name="ras" value="Labrador" />
              </div>
              <div className="forminput">
                <label htmlFor="geslacht">geslacht</label>
                <input
                  type="select"
                  name="geslacht"
                  id="geslacht"
                  value="Reu"
                />
              </div>
            </div>
            <div className="formrow">
              <div className="forminput">
                <label htmlFor="chipnr">chipNr</label>
                <input type="text" name="chipnr" id="chipnr" value="654321" />
              </div>
              <div className="forminput">
                <label htmlFor="gecastreerd">gecastreerd (Reu)</label>
                <input
                  type="select"
                  name="gecastreerd"
                  id="gecastreerd"
                  value="Nee"
                />
              </div>
            </div>
          </div>
        </details>
        <details>
          <summary>Bo</summary>
          <div className="detailscontent">
            <div className="forminput">
              <label htmlFor="naam">naam</label>
              <input type="text" id="naam" name="naam" value="Bo" />
            </div>
            <div className="forminput">
              <label htmlFor="geboortedatum">geboortedatum</label>
              <input
                type="date"
                id="geboortedatum"
                name="geboortedatum"
                value="2020-04-28"
              />
            </div>
            <div className="formrow">
              <div className="forminput">
                <label htmlFor="straat">ras</label>
                <input type="select" id="ras" name="ras" value="Beagle" />
              </div>
              <div className="forminput">
                <label htmlFor="geslacht">geslacht</label>
                <input
                  type="select"
                  name="geslacht"
                  id="geslacht"
                  value="Teef"
                />
              </div>
            </div>
            <div className="formrow">
              <div className="forminput">
                <label htmlFor="chipnr">chipNr</label>
                <input type="text" name="chipnr" id="chipnr" value="123456" />
              </div>
              <div className="forminput">
                <label htmlFor="gecastreerd">gecastreerd (Reu)</label>
                <input type="select" name="gecastreerd" id="gecastreerd" />
              </div>
            </div>
          </div>
        </details>
      </details>
      <details>
        <summary>
          Gegevens dierenarts <span>open</span>
        </summary>
        <div className="detailscontent">
          <div className="formrow">
            <div className="forminput">
              <label htmlFor="postcode">postcode</label>
              <input type="text" id="postcode" name="postcode" value="2235" />
            </div>
            <div className="forminput">
              <label htmlFor="name">naam</label>
              <input
                type="text"
                id="name"
                name="dierenarts"
                value="dierenarts"
              />
            </div>
          </div>
          <div className="forminput">
            <label htmlFor="telefoon">telefoon</label>
            <input type="text" id="telefoon" name="telefoon" value="telefoon" />
          </div>
        </div>
      </details>
      <div className="formtabs">
        <span className="tablad">Stap1</span>
        <span className="tablad">Stap2</span>
        <span className="tablad">Stap3</span>
        <span className="tablad active">Bevestiging</span>
      </div>
      <div className="forminput">
        <label htmlFor="verify">Deze gegevens zijn juist</label>
        <input type="checkbox" />
      </div>
      <SubmitButton label="Registreer" />
    </>
  );
};

export default Step4;
