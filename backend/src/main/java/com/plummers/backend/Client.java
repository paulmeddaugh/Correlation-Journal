package com.plummers.backend;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Client {
	private @Id @GeneratedValue Long id;
	private String name;
	private int placeInLine;

	Client() {}

	Client(String name, int placeInLine) {

		this.name = name;
    	this.placeInLine = placeInLine;
	}

	public Long getId() {
		return this.id;
	}

	public String getName() {
		return this.name;
	}

	public int getPlaceInLine() {
		return this.placeInLine;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPlaceInLine(int placeInLine) {
		this.placeInLine = placeInLine;
	}

	@Override
	public boolean equals(Object o) {

		if (this == o)
			return true;
		if (!(o instanceof Client))
			return false;
		Client client = (Client) o;
		return Objects.equals(this.id, client.id) && Objects.equals(this.name, client.name)
				&& Objects.equals(this.placeInLine, client.placeInLine);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.id, this.name, this.placeInLine);
	}

	@Override
	public String toString() {
		return "Employee{" + "id=" + this.id + ", name='" + this.name + '\'' + ", placeInLine='" + this.placeInLine + '\'' + '}';
	}
}
